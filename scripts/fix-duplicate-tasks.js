#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function findTaskFilesForCurrentBranch(root) {
    // Determine current git branch and map to a specs directory.
    let branch = null;
    try {
        const cp = require("child_process");
        branch = (
            cp.execSync("git rev-parse --abbrev-ref HEAD", { cwd: root }) || ""
        )
            .toString()
            .trim();
    } catch (e) {
        // fallback: no branch detected
        branch = null;
    }

    const specsDir = path.join(root, "specs");
    if (!fs.existsSync(specsDir)) return [];
    const entries = fs.readdirSync(specsDir, { withFileTypes: true });

    // If branch exactly matches a spec dir name, use it.
    if (branch) {
        const exact = entries.find((e) => e.isDirectory() && e.name === branch);
        if (exact) {
            const p = path.join(specsDir, exact.name, "tasks.md");
            return fs.existsSync(p) ? [p] : [];
        }
    }

    // Otherwise try numeric prefix match: e.g., branch '001-rework...' -> '001-*'
    const prefixMatch = branch && branch.match(/^(\d{3})/);
    if (prefixMatch) {
        const prefix = prefixMatch[1];
        const matched = entries.find(
            (e) => e.isDirectory() && e.name.startsWith(prefix),
        );
        if (matched) {
            const p = path.join(specsDir, matched.name, "tasks.md");
            return fs.existsSync(p) ? [p] : [];
        }
    }

    // Fallback: nothing to operate on
    return [];
}

function fixFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    const seen = new Set();
    const out = [];
    const idRegex = /(T\d{3,})/;
    const idMap = new Map();
    // First pass: collect checklist lines by id and remember the best (checked preferred)
    lines.forEach((ln, idx) => {
        const trimmed = ln.trim();
        if (!/^\s*- \[[ xX]\]/.test(ln)) return;
        const m = ln.match(idRegex);
        if (!m) return;
        const id = m[1];
        const checked = /- \[[xX]\]/.test(ln);
        if (!idMap.has(id)) {
            idMap.set(id, { line: ln, index: idx, checked });
        } else {
            const existing = idMap.get(id);
            // prefer a checked variant if present; otherwise keep first
            if (!existing.checked && checked) {
                idMap.set(id, { line: ln, index: idx, checked });
            }
        }
    });

    const seenIds = new Set();
    for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        if (ln.trim() === "") {
            if (out.length && out[out.length - 1].trim() === "") continue;
            out.push("");
            continue;
        }
        if (/^\s*- \[[ xX]\]/.test(ln)) {
            const m = ln.match(idRegex);
            if (m) {
                const id = m[1];
                if (seenIds.has(id)) continue; // we've already emitted the chosen one
                const chosen = idMap.get(id);
                if (chosen) {
                    out.push(chosen.line);
                    seenIds.add(id);
                    // advance i to skip any further duplicate checklist lines for this id
                    // (we'll skip them naturally because seenIds contains id)
                    continue;
                }
            }
        }
        // skip exact duplicate non-checklist lines
        if (seen.has(ln)) continue;
        seen.add(ln);
        out.push(ln);
    }
    const fixed = out.join("\n") + "\n";
    if (fixed !== raw) {
        fs.writeFileSync(filePath, fixed, "utf8");
        return true;
    }
    return false;
}

function main() {
    const root = path.resolve(__dirname, "..");
    const files = findTaskFilesForCurrentBranch(root);
    let changed = [];
    for (const f of files) {
        try {
            const did = fixFile(f);
            if (did) changed.push(f);
        } catch (e) {
            console.error("Error fixing", f, e.message);
        }
    }
    if (changed.length) {
        console.log("Fixed duplicate lines in:");
        changed.forEach((f) => console.log("  -", f));
        process.exit(0);
    }
    console.log("No duplicates found.");
}

if (require.main === module) main();
