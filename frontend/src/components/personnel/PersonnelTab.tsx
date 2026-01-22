import React from "react";
import PersonnelList from "./PersonnelList";
import Profile from "./Profile";
import CapacityWidgets from "./CapacityWidgets";
import AgentTypeChart from "./AgentTypeChart";
import personnelPersistence, {
  AgentRecord,
} from "../../services/personnelPersistence";
import { listGameStates, loadGameState } from "../../services/persistence";

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
      // Prefer loading agents from the most recent game state so agents
      // live only inside game artifacts. Fall back to legacy `personnelPersistence`.
      try {
        const games = await listGameStates();
        if (Array.isArray(games) && games.length > 0) {
          // pick most recently updated
          games.sort((x, y) => (y.updatedAt || 0) - (x.updatedAt || 0));
          const latest = games[0];
          const gameState = await loadGameState(latest.name);
          if (gameState) {
            // gameState may be the artifact directly or a wrapper with .world.artifact
            const art =
              (gameState as unknown as Record<string, unknown>)?.world
                ?.artifact ?? (gameState as unknown as Record<string, unknown>);
            const artRec = art as Record<string, unknown> | undefined;
            const agentsRaw = Array.isArray(artRec?.agents)
              ? (artRec!.agents as unknown[])
              : [];
            if (agentsRaw.length > 0) {
              const peopleRaw = Array.isArray(artRec?.people)
                ? (artRec!.people as unknown[])
                : [];
              const a = agentsRaw.map((agUnknown) => {
                const ag = agUnknown as Record<string, unknown>;
                // find linked person
                const person = (peopleRaw as unknown[]).find((p) => {
                  const pr = p as Record<string, unknown>;
                  return pr && pr.id && pr.id === ag.personId;
                }) as Record<string, unknown> | undefined | null;
                const name =
                  (ag.codeName as string) ||
                  `${person?.firstName || ""} ${person?.lastName || ""}`.trim();
                return {
                  id: ag.id as string,
                  name,
                  firstName: person?.firstName as string | undefined,
                  lastName: person?.lastName as string | undefined,
                  homeZoneId: person?.homeZoneId as string | undefined,
                  intelligenceLevel: person?.intelligenceLevel as
                    | number
                    | undefined,
                  agentType:
                    (ag.agentType as string) ||
                    (person?.occupation as string | undefined),
                  attributes:
                    (person?.attributes as Record<string, unknown>) ||
                    (ag.attributes as Record<string, unknown> | undefined),
                  skills:
                    (person?.skills as Record<string, unknown>) ||
                    (ag.skills as Record<string, unknown> | undefined),
                  ...(ag as Record<string, unknown>),
                } as Agent;
              });
              setAgents(a);
              setSelected((prev) => (prev ? prev : a.length > 0 ? a[0] : prev));
              return;
            }
          }
        }
      } catch (e) {
        // ignore game-state read failures and fall back
      }

      // legacy fallback: list top-level agent configs
      const list = await personnelPersistence.listAgents();
      // DEBUG: log raw persistence entries for diagnostics
      try {
        // eslint-disable-next-line no-console
        console.debug("PersonnelTab: listAgents() -> count", list.length, list);
      } catch (e) {
        // ignore logging failures
      }
      if (!mounted) return;
      const a = list.map((l) => {
        const ag = l.agent as AgentRecord;
        // prefer codename, fall back to combined first/last
        const name =
          typeof ag.codename === "string"
            ? ag.codename
            : `${ag.firstName || ""} ${ag.lastName || ""}`.trim();
        const intelligenceLevel =
          typeof ag.intelligenceLevel === "number"
            ? ag.intelligenceLevel
            : undefined;
        // agentType may be stored directly or inferred from person's occupation
        const agentType =
          typeof ag.agentType === "string" ? ag.agentType : undefined;
        return {
          id: typeof ag.id === "string" ? ag.id : l.id,
          name,
          intelligenceLevel,
          agentType,
          attributes: (ag as unknown as Record<string, unknown>)?.attributes as
            | Record<string, unknown>
            | undefined,
          skills: (ag as unknown as Record<string, unknown>)?.skills as
            | Record<string, unknown>
            | undefined,
          homeZoneId: (ag as unknown as Record<string, unknown>)?.homeZoneId as
            | string
            | undefined,
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
          attributes: (ag as unknown as Record<string, unknown>)?.attributes as
            | Record<string, unknown>
            | undefined,
          skills: (ag as unknown as Record<string, unknown>)?.skills as
            | Record<string, unknown>
            | undefined,
          homeZoneId: (ag as unknown as Record<string, unknown>)?.homeZoneId as
            | string
            | undefined,
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
          // DEBUG: log raw persistence entries when handling create events
          try {
            // eslint-disable-next-line no-console
            console.debug(
              "PersonnelTab:onCreated: listAgents() -> count",
              list.length,
              list,
            );
          } catch (e) {
            // ignore
          }
          if (!mounted) return;
          const a = list.map((l) => {
            const ag = l.agent as AgentRecord;
            const name =
              typeof ag.codename === "string"
                ? ag.codename
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
              attributes: (ag as unknown as Record<string, unknown>)
                ?.attributes as Record<string, unknown> | undefined,
              skills: (ag as unknown as Record<string, unknown>)?.skills as
                | Record<string, unknown>
                | undefined,
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
          homeZoneId: (ag as unknown as Record<string, unknown>)?.homeZoneId as
            | string
            | undefined,
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
            padding: "0 12px",
          }}
        >
          <div
            style={{
              minHeight: 120,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            <CapacityWidgets />
          </div>
          <div
            style={{
              minHeight: 120,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            <AgentTypeChart agents={agents} size={100} />
          </div>
        </div>

        <div>
          <PersonnelList
            agents={agents}
            onActivate={(a) => setSelected(a as Agent)}
            onFocus={(a) => setSelected(a as Agent)}
          />
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
