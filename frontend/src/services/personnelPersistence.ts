import {
  saveConfig,
  loadConfig,
  listConfigs,
  deleteConfig,
} from "./persistence";

export type AgentRecord = {
  id: string;
  firstName?: string;
  lastName?: string;
  codename?: string;
  role?: string;
  pay?: number;
  status?: string;
  agentType?: string;
  leadership?: number;
  superiorId?: string | null;
  // other fields allowed
  [k: string]: unknown;
};

const AGENT_PREFIX = "agent:";

export async function saveAgent(agent: AgentRecord) {
  const id = agent.id || String(Date.now());
  const key = `${AGENT_PREFIX}${id}`;
  await saveConfig(key, { ...agent, id });
  return id;
}

export async function loadAgent(id: string): Promise<AgentRecord | null> {
  const key = `${AGENT_PREFIX}${id}`;
  const rec = await loadConfig(key);
  return (rec as AgentRecord) || null;
}

export async function listAgents(): Promise<
  Array<{ id: string; updatedAt: number; agent: AgentRecord }>
> {
  const all = await listConfigs();
  const agents = all
    .filter((r) => r.name && r.name.startsWith(AGENT_PREFIX))
    .map((r) => ({
      id: r.name.replace(AGENT_PREFIX, ""),
      updatedAt: r.updatedAt,
      agent: null as unknown as AgentRecord,
    }));

  // load full agent payloads
  for (const a of agents) {
    const payload = await loadAgent(a.id);
    a.agent = payload || { id: a.id };
  }
  return agents;
}

export async function deleteAgent(id: string) {
  const key = `${AGENT_PREFIX}${id}`;
  await deleteConfig(key);
}

export default { saveAgent, loadAgent, listAgents, deleteAgent };
