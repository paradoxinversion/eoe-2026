import React, { useState } from "react";
import { migrateFixture } from "../services/migration";

type Report = any;

export default function MigrationTool(): JSX.Element {
  const [fileName, setFileName] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setReport(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    try {
      const raw = await f.text();
      // strip simple comments to be tolerant of human-edited JSON
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");
      const fixture = JSON.parse(stripComments(raw));
      const { transformed, report } = migrateFixture(fixture, { dryRun: true });
      setReport(report);
    } catch (err: any) {
      setError(String(err?.message || err));
    }
  }

  function downloadReport() {
    if (!report || !fileName) return;
    const safe = fileName.replace(/\.[^.]+$/, "");
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safe}-report.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Migration Tool (Dry-run)</h3>
      <p>
        Upload a fixture JSON file to run a dry-run migration and review the
        report.
      </p>
      <input type="file" accept="application/json" onChange={handleFile} />
      {fileName ? (
        <div style={{ marginTop: 8 }}>Selected: {fileName}</div>
      ) : null}
      {error ? <pre style={{ color: "#a00" }}>{error}</pre> : null}
      {report ? (
        <div style={{ marginTop: 12 }}>
          <h4>Report</h4>
          <pre
            style={{
              maxHeight: 320,
              overflow: "auto",
              background: "#f6f6f6",
              padding: 8,
            }}
          >
            {JSON.stringify(report, null, 2)}
          </pre>
          <button onClick={downloadReport} style={{ marginTop: 8 }}>
            Download Report
          </button>
        </div>
      ) : null}
    </div>
  );
}
