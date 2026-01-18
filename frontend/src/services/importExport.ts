import {
    exportConfig as persistenceExport,
    importConfig as persistenceImport,
} from "./persistence";

export async function exportConfigToString(
    name: string,
): Promise<string | null> {
    return await persistenceExport(name);
}

export async function downloadConfig(name: string): Promise<void> {
    const txt = await exportConfigToString(name);
    if (!txt) return;
    const blob = new Blob([txt], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export async function importFromString(
    json: string,
    nameOverride?: string,
): Promise<string> {
    return await persistenceImport(json, nameOverride);
}

export async function importFromFile(
    file: File,
    nameOverride?: string,
): Promise<string> {
    const txt = await file.text();
    return await importFromString(txt, nameOverride);
}

export default {
    exportConfigToString,
    downloadConfig,
    importFromString,
    importFromFile,
};
