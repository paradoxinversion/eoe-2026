import React from "react";
import { intelligenceToConfidence } from "../../services/personnelService";
import { listGameStates, loadGameState } from "../../services/persistence";

type Person = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  homeZoneId?: string;
  intelligenceLevel?: number;
  agentType?: string;
  role?: string;
  leadership?: number;
  pay?: number;
  status?: string;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  [k: string]: unknown;
};

export default function Profile({ person }: { person: Person }) {
  const confidence =
    person.intelligenceLevel !== undefined
      ? intelligenceToConfidence(person.intelligenceLevel)
      : 100;

  const displayName =
    `${person.firstName || ""} ${person.lastName || ""}`.trim() ||
    person.name ||
    person.id;

  const leadershipValue =
    (person.attributes &&
      ((person.attributes as Record<string, unknown>)?.leadership as
        | number
        | undefined)) ??
    person.leadership ??
    "—";

  const [originName, setOriginName] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function resolveZone() {
      try {
        if (!person?.homeZoneId) return;
        const games = await listGameStates();
        if (!Array.isArray(games) || games.length === 0) return;
        games.sort((x, y) => (y.updatedAt || 0) - (x.updatedAt || 0));
        const latest = games[0];
        const gameState = await loadGameState(latest.name);
        const art =
          (gameState as unknown as Record<string, unknown>)?.world?.artifact ??
          (gameState as unknown as Record<string, unknown>);
        const zone = (art?.zones || []).find(
          (z: unknown) =>
            (z as Record<string, unknown>).id === person.homeZoneId,
        );
        if (mounted) setOriginName(zone?.name ?? null);
      } catch (e) {
        // ignore
      }
    }
    void resolveZone();
    return () => {
      mounted = false;
    };
  }, [person?.homeZoneId]);

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    // ID and Type removed per UI update
    { label: "Role", value: person.role || "—" },
    { label: "Leadership", value: leadershipValue },
    { label: "Pay", value: person.pay ?? "—" },
    { label: "Status", value: person.status || "—" },
    { label: "Origin", value: originName ?? person.homeZoneId ?? "—" },
  ];

  return (
    <div
      style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}
      aria-labelledby={`person-${person.id}-name`}
    >
      <h2
        id={`person-${person.id}-name`}
        data-testid="person-name"
        style={{ fontSize: 18, fontWeight: 700, margin: 0 }}
      >
        {displayName}
      </h2>
      <div style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 8 }}>Confidence: {confidence}%</div>
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          aria-labelledby={`person-${person.id}-name`}
        >
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td
                  style={{
                    width: 110,
                    color: "#666",
                    padding: "4px 8px",
                    verticalAlign: "top",
                  }}
                >
                  {r.label}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {typeof r.value === "string" && r.value === "—" ? (
                    <span aria-label="missing">—</span>
                  ) : (
                    r.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Attributes (e.g., health, intelligence) */}
        {person.attributes && Object.keys(person.attributes).length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Attributes</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(person.attributes).map(([k, v]) => (
                <div key={k} style={{ minWidth: 110 }}>
                  <div style={{ color: "#666", fontSize: 12 }}>
                    {k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </div>
                  <div style={{ fontWeight: 600 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills (e.g., fighting, medicine) */}
        {person.skills && Object.keys(person.skills).length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Skills</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(person.skills).map(([k, v]) => (
                <div key={k} style={{ minWidth: 110 }}>
                  <div style={{ color: "#666", fontSize: 12 }}>
                    {k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </div>
                  <div style={{ fontWeight: 600 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
