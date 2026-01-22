import React from "react";
import personnelPersistence from "../../services/personnelPersistence";
import { listGameStates, loadGameState } from "../../services/persistence";
import { computeCapacity } from "../../services/personnelService";

export default function CapacityWidgets() {
  const [loading, setLoading] = React.useState(true);
  const [current, setCurrent] = React.useState(0);
  const [maxCapacity, setMaxCapacity] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Prefer authoritative agents stored in the latest `game:` save.
        type AgentLike = Record<string, unknown> & {
          personId?: string;
          leadership?: number;
          attributes?: Record<string, unknown>;
          role?: string;
          agentType?: string;
          type?: string;
        };
        let agents: AgentLike[] = [];
        try {
          const games = await listGameStates();
          if (games && games.length) {
            const latest = games.reduce((a, b) =>
              a.updatedAt >= b.updatedAt ? a : b,
            );
            const state = await loadGameState(latest.name);
            const art =
              (state as unknown as Record<string, unknown>)?.world?.artifact ||
              (state as unknown as Record<string, unknown>);
            const maybeAgents =
              (art as unknown as Record<string, unknown>)?.agents || [];
            if (Array.isArray(maybeAgents)) {
              // enrich agents with linked person attributes when available
              const people =
                (art as unknown as Record<string, unknown>)?.people || [];
              agents = (maybeAgents as unknown[]).map((agUnknown) => {
                const ag = agUnknown as AgentLike;
                if (ag.leadership === undefined) {
                  const person = (people as unknown[]).find((p) => {
                    const pp = p as Record<string, unknown>;
                    return pp && pp.id && pp.id === ag.personId;
                  }) as Record<string, unknown> | undefined;
                  if (
                    person &&
                    person.attributes &&
                    typeof (person.attributes as Record<string, unknown>)
                      .leadership === "number"
                  ) {
                    return Object.assign({}, ag, {
                      leadership: (person.attributes as Record<string, unknown>)
                        .leadership as number,
                    });
                  }
                }
                return ag;
              });
            }
          }
        } catch (e) {
          // fall back to legacy per-agent store if game-state read fails
          agents = [];
        }

        if ((!agents || agents.length === 0) && mounted) {
          const list = await personnelPersistence.listAgents();
          agents = list.map((l) => l.agent as AgentLike);
        }

        if (!mounted) return;
        const cnt = agents.length;
        const cap = agents.reduce((acc, a) => {
          const role =
            (a.role as string | undefined) ??
            (a.agentType as string | undefined) ??
            (a.type as string | undefined);
          if (role === "Recruit") return acc; // recruits don't contribute leadership capacity
          const leadership =
            (a.leadership as number | undefined) ??
            ((a.attributes as Record<string, unknown> | undefined)
              ?.leadership as number | undefined) ??
            0;
          return acc + (computeCapacity(leadership) || 0);
        }, 0);
        setCurrent(cnt);
        setMaxCapacity(cap);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pct = maxCapacity > 0 ? Math.round((current / maxCapacity) * 100) : 0;
  const warning = pct >= 90 && pct < 100;

  if (loading) return <div>Loading capacity...</div>;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "stretch",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: 8,
          border: "1px solid #ddd",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        aria-live="polite"
      >
        <div style={{ fontSize: 12, color: "#666" }}>Agents</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{current}</div>
      </div>

      <div
        style={{
          flex: 1,
          padding: 8,
          border: "1px solid #ddd",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        aria-live="polite"
      >
        <div style={{ fontSize: 12, color: "#666" }}>Capacity</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{maxCapacity}</div>
        <div style={{ fontSize: 12, color: warning ? "#b58900" : "#666" }}>
          {pct}%
        </div>
      </div>

      {/* Status text moved into the Capacity card; remove standalone status box */}
    </div>
  );
}
