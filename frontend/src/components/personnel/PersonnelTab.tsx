import React from "react";
import AgentList from "./AgentList";
import Profile from "./Profile";
import CapacityWidgets from "./CapacityWidgets";
import AgentTypeChart from "./AgentTypeChart";
import personnelPersistence from "../../services/personnelPersistence";

type Agent = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  intelligenceLevel?: number;
  agentType?: string;
};

export default function PersonnelTab() {
  const [selected, setSelected] = React.useState<Agent | null>(null);
  const [agents, setAgents] = React.useState<Agent[]>([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await personnelPersistence.listAgents();
      if (!mounted) return;
      const a = list.map((l) => {
        const ag = l.agent as any;
        return {
          id: ag.id || l.id,
          name: ag.name || `${ag.firstName || ""} ${ag.lastName || ""}`.trim(),
          intelligenceLevel: ag.intelligenceLevel,
          agentType: ag.agentType,
          ...ag,
        } as Agent;
      });
      setAgents(a);
      if (!selected && a.length > 0) setSelected(a[0]);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>Personnel</h2>
        <div style={{ marginBottom: 16 }}>
          <CapacityWidgets />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AgentTypeChart agents={agents} size={140} />
          <div style={{ flex: 1 }}>
            <AgentList
              agents={agents}
              onFocus={(a) => setSelected(a as Agent)}
            />
          </div>
        </div>
      </div>
      <div style={{ width: 360 }}>
        <h3>Profile</h3>
        {selected ? <Profile person={selected} /> : <div>Select an agent</div>}
      </div>
    </div>
  );
}
