#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const addFormats = require("ajv-formats").default;

function usage() {
    console.log(
        "Usage: node verify-fixtures.js <fixtures-dir> <contracts-dir> [--report-dir=path]",
    );
    process.exit(2);
}

const argv = process.argv.slice(2);
if (argv.length < 2) usage();
const fixturesDir = path.resolve(argv[0]);
const contractsDir = path.resolve(argv[1]);
const reportArg = argv.find((a) => a.startsWith("--report-dir="));
const applyFixesArg = argv.find((a) => a === "--apply-fixes" || a === "--fix");
const APPLY_FIXES = !!applyFixesArg;
const reportDir = reportArg
    ? path.resolve(reportArg.split("=")[1])
    : path.resolve(process.cwd(), "verify-reports");

if (!fs.existsSync(fixturesDir)) {
    console.error("Fixtures dir not found:", fixturesDir);
    process.exit(2);
}
if (!fs.existsSync(contractsDir)) {
    console.error("Contracts dir not found:", contractsDir);
    process.exit(2);
}

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

// Load all schemas from contracts dir and add to ajv
const schemas = {};
for (const f of fs.readdirSync(contractsDir)) {
    const full = path.join(contractsDir, f);
    if (!fs.statSync(full).isFile()) continue;
    if (!f.endsWith(".json")) continue;
    try {
        const j = JSON.parse(fs.readFileSync(full, "utf8"));
        const id = j.$id || j.id || "/schemas/" + f;
        j.$id = id;
        ajv.addSchema(j, id);
        schemas[f] = id;
    } catch (err) {
        console.error("Failed to parse schema", f, err.message);
        process.exit(2);
    }
}

// Map fixture top-level keys to schema filenames (expect these files in contracts/)
const TOP_LEVEL_MAP = {
    people: "person.schema.json",
    agents: "agent.schema.json",
    zones: "zone.schema.json",
    buildings: "building.schema.json",
    governingOrganizations: "governingOrganization.schema.json",
};

function getSchemaIdForTopLevel(key) {
    const file = TOP_LEVEL_MAP[key];
    if (!file) return null;
    return schemas[file] || null;
}

let total = 0;
let failed = 0;

for (const f of fs.readdirSync(fixturesDir)) {
    const full = path.join(fixturesDir, f);
    if (!fs.statSync(full).isFile()) continue;
    if (!f.endsWith(".json")) continue;
    total++;
    let report = { fixture: f, ok: true, details: {} };
    try {
        const text = fs.readFileSync(full, "utf8");
        // tolerate trailing comments (strip // and /* */)
        const cleaned = text
            .replace(/\/\/.*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "");
        const obj = JSON.parse(cleaned);
        // Validate each top-level array against mapped schema
        for (const key of Object.keys(obj)) {
            const schemaId = getSchemaIdForTopLevel(key);
            if (!schemaId) {
                // skip unknown sections
                continue;
            }
            const arr = obj[key];
            if (!Array.isArray(arr)) {
                report.ok = false;
                report.details[key] = {
                    ok: false,
                    errors: [{ message: "Expected array" }],
                };
                failed++;
                continue;
            }
            const detail = {
                ok: true,
                total: arr.length,
                failed: 0,
                errors: [],
            };
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                let valid = ajv.validate(schemaId, item);
                if (!valid && APPLY_FIXES) {
                    // attempt auto-fixes for common person/agent issues
                    if (key === "people") {
                        // if `name` present, split into first/last
                        if (!item.firstName && !item.lastName && item.name) {
                            const parts = String(item.name).trim().split(/\s+/);
                            item.firstName = parts.shift() || "Anon";
                            item.lastName = parts.join(" ") || "Unknown";
                            delete item.name;
                        }
                        // if firstName empty or null, set to Anon
                        if (
                            !item.firstName ||
                            String(item.firstName).trim().length === 0
                        ) {
                            item.firstName = "Anon";
                        }
                        // ensure attributes
                        if (!item.attributes) {
                            item.attributes = {
                                health: 50,
                                intelligence: 50,
                                strength: 50,
                                agility: 50,
                                endurance: 50,
                                empathy: 50,
                                charisma: 50,
                            };
                        }
                        // ensure skills
                        if (!item.skills) {
                            item.skills = {
                                fighting: 0,
                                medicine: 0,
                                business: 0,
                                finance: 0,
                                publicPlanning: 0,
                                science: 0,
                            };
                        }
                        if (item.intelligenceLevel === undefined)
                            item.intelligenceLevel = 50;
                        if (!item.governingOrganizationSentiments)
                            item.governingOrganizationSentiments = {};
                        // legacy single 'sentiment' -> governingOrganizationSentiments
                        if (item.sentiment !== undefined) {
                            if (
                                obj.governingOrganizations &&
                                Array.isArray(obj.governingOrganizations) &&
                                obj.governingOrganizations.length === 1
                            ) {
                                const govId = obj.governingOrganizations[0].id;
                                item.governingOrganizationSentiments = {
                                    [govId]: item.sentiment,
                                };
                            } else {
                                item.governingOrganizationSentiments = {};
                            }
                            delete item.sentiment;
                        }
                    }
                    if (key === "agents") {
                        if (!item.codeName) {
                            if (item.name && String(item.name).trim()) {
                                const parts = String(item.name)
                                    .trim()
                                    .split(/\s+/);
                                item.codeName = parts.join("-").toLowerCase();
                                delete item.name;
                            } else if (item.personId) {
                                const short =
                                    (item.personId.split("-")[1] || "").slice(
                                        0,
                                        6,
                                    ) || Math.random().toString(36).slice(2, 6);
                                item.codeName = `agent-${short}`;
                                if (item.name !== undefined) delete item.name;
                            } else {
                                item.codeName = `agent-${Math.random().toString(36).slice(2, 7)}`;
                                if (item.name !== undefined) delete item.name;
                            }
                            // remove legacy name property if present to satisfy schema's additionalProperties
                            if (item.name !== undefined) delete item.name;
                        }
                    }
                    // revalidate after fixes
                    valid = ajv.validate(schemaId, item);
                }
                if (!valid) {
                    detail.ok = false;
                    detail.failed++;
                    detail.errors.push({ index: i, errors: ajv.errors });
                }
            }
            if (!detail.ok) {
                report.ok = false;
                failed += detail.failed;
            }
            report.details[key] = detail;
        }
        // If apply-fixes was enabled, write the fixed fixture out for review
        if (APPLY_FIXES) {
            try {
                const fixedDir = path.join(
                    path.dirname(fixturesDir),
                    "fixtures-fixed",
                );
                if (!fs.existsSync(fixedDir))
                    fs.mkdirSync(fixedDir, { recursive: true });
                fs.writeFileSync(
                    path.join(fixedDir, f),
                    JSON.stringify(obj, null, 2) + "\n",
                );
            } catch (werr) {
                console.error(
                    "Failed to write fixed fixture for",
                    f,
                    werr && werr.message,
                );
            }
        }
    } catch (err) {
        report.ok = false;
        report.details._parse = { ok: false, message: err.message };
        failed++;
    }

    fs.writeFileSync(
        path.join(reportDir, f.replace(".json", "-report.json")),
        JSON.stringify(report, null, 2),
    );
    console.log(f, report.ok ? "OK" : "FAIL");
}

const summary = { total, failed };
fs.writeFileSync(
    path.join(reportDir, "summary.json"),
    JSON.stringify(summary, null, 2),
);
if (failed > 0) {
    console.error(`Verification failed: ${failed}/${total} fixtures`);
    process.exit(1);
} else {
    console.log(`All fixtures verified: ${total} fixtures`);
    process.exit(0);
}
