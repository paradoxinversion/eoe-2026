import React from "react";
import { agentTypeSummary } from "../../services/personnelService";
import personnelPersistence from "../../services/personnelPersistence";

type Props = {
  agents?: Array<{ agentType?: string }>;
  size?: number;
};

const COLORS = [
  "#2E86AB",
  "#F6C85F",
  "#F28C8C",
  "#7BD389",
  "#B39BC8",
  "#F5A623",
];

function buildSegments(counts: Record<string, number>, total: number) {
  const items = Object.entries(counts);
  let start = 0;
  return items.map(([type, count], i) => {
    const value = count;
    const angle = (value / total) * 360;
    const seg = {
      type,
      count: value,
      start,
      angle,
      color: COLORS[i % COLORS.length],
    };
    start += angle;
    return seg;
  });
}

export default function AgentTypeChart({
  agents: propAgents,
  size = 120,
}: Props) {
  const [agents, setAgents] = React.useState<Array<{ agentType?: string }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (propAgents) {
        setAgents(propAgents);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const list = await personnelPersistence.listAgents();
        if (!mounted) return;
        setAgents(list.map((l) => l.agent || {}));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [propAgents]);

  if (loading) return <div>Loading chart...</div>;

  const summary = agentTypeSummary(agents);
  const total = Object.values(summary).reduce((s, v) => s + v, 0);
  if (total === 0) return <div>No agents</div>;

  const segments = buildSegments(summary, total);
  const radius = size / 2;
  const circumference = Math.PI * size;

  return (
    <div
      style={{ width: size, textAlign: "center" }}
      aria-label="Agent type breakdown"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-hidden="false"
      >
        <g transform={`translate(${radius},${radius})`}>
          {segments.map((s, i) => {
            const r = radius * 0.8;
            const dash = Math.max(1, (s.angle / 360) * (2 * Math.PI * r));
            const dashOffset = (s.start / 360) * (2 * Math.PI * r);
            return (
              <circle
                key={s.type}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={radius * 0.4}
                strokeDasharray={`${dash} ${2 * Math.PI * r}`}
                strokeDashoffset={-dashOffset}
                style={{
                  transition: "stroke-dasharray 300ms, stroke-dashoffset 300ms",
                }}
              />
            );
          })}
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            {total}
          </text>
        </g>
      </svg>
      <div style={{ marginTop: 8 }}>
        {segments.map((s) => (
          <div
            key={s.type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                background: s.color,
                display: "inline-block",
                borderRadius: 3,
              }}
            />
            <span>
              {s.type} ({s.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
