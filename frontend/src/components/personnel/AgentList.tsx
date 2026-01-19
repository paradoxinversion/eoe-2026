import React from "react";

type Agent = {
  id: string;
  name: string;
  agentType?: string;
};

export default function AgentList({
  agents,
  onFocus,
}: {
  agents: Agent[];
  onFocus: (a: Agent) => void;
}) {
  return (
    <div>
      {agents.map((a) => (
        <div
          key={a.id}
          style={{
            padding: 8,
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
          onClick={() => onFocus(a)}
        >
          <div style={{ fontWeight: 600 }}>{a.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{a.agentType}</div>
        </div>
      ))}
    </div>
  );
}
