import React from "react";
import personnelPersistence from "../../services/personnelPersistence";
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
        const list = await personnelPersistence.listAgents();
        if (!mounted) return;
        const agents = list.map((l) => l.agent);
        const cnt = agents.length;
        const cap = agents.reduce(
          (acc, a) => acc + (computeCapacity(a.leadership ?? 0) || 0),
          0,
        );
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

  const atCapacity = maxCapacity > 0 ? current >= maxCapacity : false;
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

      <div
        style={{
          flex: 1,
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {atCapacity ? (
          <div style={{ color: "#c62828", fontWeight: 700 }}>At capacity</div>
        ) : warning ? (
          <div style={{ color: "#b58900", fontWeight: 600 }}>
            Approaching capacity
          </div>
        ) : (
          <div style={{ color: "#2e7d32" }}>Capacity OK</div>
        )}
      </div>
    </div>
  );
}
