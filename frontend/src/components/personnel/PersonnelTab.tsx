import React from "react";
import AgentList from "./AgentList";
import Profile from "./Profile";

type Agent = {
  id: string;
  name: string;
  intelligenceLevel?: number;
  agentType?: string;
};

const mockAgents: Agent[] = [
  { id: "a1", name: "Astra", intelligenceLevel: 7, agentType: "Scientist" },
  { id: "a2", name: "Borin", intelligenceLevel: 4, agentType: "Worker" },
];

export default function PersonnelTab() {
  const [selected, setSelected] = React.useState<Agent | null>(null);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>Personnel</h2>
        <AgentList agents={mockAgents} onFocus={setSelected} />
      </div>
      <div style={{ width: 360 }}>
        <h3>Profile</h3>
        {selected ? <Profile person={selected} /> : <div>Select an agent</div>}
      </div>
    </div>
  );
}
