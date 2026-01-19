#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function findTaskFiles(root) {
    const specsDir = path.join(root, "specs");
    if (!fs.existsSync(specsDir)) return [];
    const entries = fs.readdirSync(specsDir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        const p = path.join(specsDir, e.name, "tasks.md");
        if (fs.existsSync(p)) files.push(p);
    }
    return files;
}

function validateFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    const taskIdRegex = /\bT\d{3,}\b/;
    const checklistLineRegex = /^\s*- \[[ xX]\] \s*T\d{3,}/;
    const foundIds = new Map();
    const duplicates = [];
    const formatProblems = [];

    lines.forEach((ln, idx) => {
        const m = ln.match(/(T\d{3,})/);
        if (m) {
            const id = m[1];
            if (foundIds.has(id)) {
                duplicates.push({
                    id,
                    first: foundIds.get(id),
                    second: idx + 1,
                });
            } else {
                foundIds.set(id, idx + 1);
            }
        }
        // Check checklist formatting roughly
        if (ln.includes("T") && ln.trim().startsWith("-")) {
            if (!/^\s*- \[[ xX]\] \s*T\d{3,}/.test(ln)) {
                formatProblems.push({ line: idx + 1, text: ln.trim() });
            }
        }
    });

    return { duplicates, formatProblems };
}

function main() {
    const root = path.resolve(__dirname, "..");
    const files = findTaskFiles(root);
    if (!files.length) {
        console.log("No tasks.md files found under specs/.");
        return 0;
    }
    let hadProblems = false;
    for (const f of files) {
        const { duplicates, formatProblems } = validateFile(f);
        if (duplicates.length || formatProblems.length) {
            hadProblems = true;
            console.error("\nProblems in", f);
            if (duplicates.length) {
                console.error("Duplicate task IDs:");
                duplicates.forEach((d) =>
                    console.error(
                        `  ${d.id}: lines ${d.first} and ${d.second}`,
                    ),
                );
            }
            if (formatProblems.length) {
                console.error("Formatting problems:");
                formatProblems.forEach((p) =>
                    console.error(`  line ${p.line}: ${p.text}`),
                );
            }
        }
    }
    if (hadProblems) {
        console.error(
            "\nTask validation failed. Fix duplicates/formatting in tasks.md before committing.",
        );
        process.exit(2);
    }
    console.log("Task validation passed.");
    return 0;
}

if (require.main === module) {
    main();
}
