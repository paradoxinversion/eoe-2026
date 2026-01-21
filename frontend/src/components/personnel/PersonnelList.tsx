import React from "react";
import AgentList from "./AgentList";

type Agent = {
  id: string;
  name: string;
  agentType?: string;
};

export default function PersonnelList({
  agents,
  onFocus,
  onActivate,
}: {
  agents: Agent[];
  onFocus?: (a: Agent) => void;
  onActivate?: (a: Agent) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"name" | "type">("name");

  const types = React.useMemo(() => {
    const s = new Set<string>();
    for (const a of agents) if (a.agentType) s.add(a.agentType);
    return Array.from(s).sort();
  }, [agents]);

  const filtered = React.useMemo(() => {
    let out = agents.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((a) => (a.name || "").toLowerCase().includes(q));
    }
    if (typeFilter !== "all") {
      out = out.filter((a) => (a.agentType || "") === typeFilter);
    }
    if (sortBy === "name") {
      out.sort((x, y) => (x.name || "").localeCompare(y.name || ""));
    } else {
      out.sort((x, y) => (x.agentType || "").localeCompare(y.agentType || ""));
    }
    return out;
  }, [agents, query, typeFilter, sortBy]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          aria-label="search-agents"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 6 }}
        />
        <select
          aria-label="filter-type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          aria-label="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{ padding: 6 }}
        >
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
        </select>
      </div>
      <AgentList agents={filtered} onFocus={onFocus} onActivate={onActivate} />
    </div>
  );
}
