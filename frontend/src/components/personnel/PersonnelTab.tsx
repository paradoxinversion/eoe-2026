import React from "react";
import PersonnelList from "./PersonnelList";
import Profile from "./Profile";
import CapacityWidgets from "./CapacityWidgets";
import AgentTypeChart from "./AgentTypeChart";
import personnelPersistence, {
  AgentRecord,
} from "../../services/personnelPersistence";

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
        const ag = l.agent as AgentRecord;
        const name =
          typeof ag.name === "string"
            ? ag.name
            : `${ag.firstName || ""} ${ag.lastName || ""}`.trim();
        const intelligenceLevel =
          typeof ag.intelligenceLevel === "number"
            ? ag.intelligenceLevel
            : undefined;
        const agentType =
          typeof ag.agentType === "string" ? ag.agentType : undefined;
        return {
          id: typeof ag.id === "string" ? ag.id : l.id,
          name,
          intelligenceLevel,
          agentType,
          ...ag,
        } as Agent;
      });
      setAgents(a);
      setSelected((prev) => (prev ? prev : a.length > 0 ? a[0] : prev));
    }
    load();
    // pickup any pending local agent stored by Main before this tab mounted
    try {
      const pending = sessionStorage.getItem("personnel:pendingLocal");
      if (pending) {
        const ag = JSON.parse(pending) as AgentRecord;
        const newAgent: Agent = {
          id: ag.id,
          name:
            typeof ag.name === "string"
              ? ag.name
              : `${ag.firstName || ""} ${ag.lastName || ""}`.trim(),
          intelligenceLevel:
            typeof ag.intelligenceLevel === "number"
              ? ag.intelligenceLevel
              : undefined,
          agentType:
            typeof ag.agentType === "string" ? ag.agentType : undefined,
          ...ag,
        };
        setAgents((prev) => {
          if (prev.find((p) => p.id === newAgent.id)) return prev;
          return [...prev, newAgent];
        });
        setSelected(newAgent);
        try {
          sessionStorage.removeItem("personnel:pendingLocal");
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore json/storage errors
    }
    const onCreated = (e: Event) => {
      try {
        const d = (e as CustomEvent<{ id?: string }>).detail;
        if (!d || !d.id) return;
        // reload and set selected to the created id
        (async () => {
          const list = await personnelPersistence.listAgents();
          if (!mounted) return;
          const a = list.map((l) => {
            const ag = l.agent as AgentRecord;
            const name =
              typeof ag.name === "string"
                ? ag.name
                : `${ag.firstName || ""} ${ag.lastName || ""}`.trim();
            const intelligenceLevel =
              typeof ag.intelligenceLevel === "number"
                ? ag.intelligenceLevel
                : undefined;
            const agentType =
              typeof ag.agentType === "string" ? ag.agentType : undefined;
            return {
              id: typeof ag.id === "string" ? ag.id : l.id,
              name,
              intelligenceLevel,
              agentType,
              ...ag,
            } as Agent;
          });
          setAgents(a);
          const found = a.find((x) => x.id === d.id);
          if (found) setSelected(found);
        })();
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener("personnel:created", onCreated as EventListener);
    const onLocalCreated = (e: Event) => {
      try {
        const ag = (e as CustomEvent<AgentRecord>).detail;
        if (!ag || !ag.id) return;
        const newAgent = {
          id: ag.id,
          name:
            typeof ag.name === "string"
              ? ag.name
              : `${ag.firstName || ""} ${ag.lastName || ""}`.trim(),
          intelligenceLevel:
            typeof ag.intelligenceLevel === "number"
              ? ag.intelligenceLevel
              : undefined,
          agentType:
            typeof ag.agentType === "string" ? ag.agentType : undefined,
          ...ag,
        } as Agent;
        setAgents((prev) => {
          if (prev.find((p) => p.id === newAgent.id)) return prev;
          return [...prev, newAgent];
        });
        setSelected(newAgent);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener(
      "personnel:created:local",
      onLocalCreated as EventListener,
    );
    return () => {
      mounted = false;
      window.removeEventListener(
        "personnel:created",
        onCreated as EventListener,
      );
      window.removeEventListener(
        "personnel:created:local",
        onLocalCreated as EventListener,
      );
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
            <PersonnelList
              agents={agents}
              onActivate={(a) => setSelected(a as Agent)}
              onFocus={(a) => setSelected(a as Agent)}
            />
          </div>
        </div>
      </div>
      <div style={{ width: 360 }}>
        <h3>Profile</h3>
        <div aria-live="polite" style={{ minHeight: 28, marginBottom: 8 }}>
          {selected ? (
            <div style={{ fontSize: 13, color: "#333" }}>
              Selected: {selected.name}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#666" }}>No agent selected</div>
          )}
        </div>
        {selected ? <Profile person={selected} /> : <div>Select an agent</div>}
      </div>
    </div>
  );
}
