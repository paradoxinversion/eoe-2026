import type { UUID } from "./person";

export type AgentRole =
  | "Recruit"
  | "Administrator"
  | "Scientist"
  | "Doctor"
  | "Soldier";

export interface AgentInventoryItem {
  itemId: string;
  qty: number;
}

export interface Agent {
  id: UUID;
  personId: UUID;
  codeName: string;
  role: AgentRole;
  affiliationId?: UUID;
  inventory?: AgentInventoryItem[];
  health: number;
  pay: number;
  assigned_project_ids?: string[];
  hired_at?: string; // ISO date
  status: AgentStatus;
}

export type AgentStatus = "active" | "idle" | "unavailable" | "dead";

export function createAgent(
  id: string,
  name: string,
  pay = 0,
  opts?: Partial<Pick<Agent, "role" | "hired_at">>,
): Agent {
  return {
    id,
    name,
    pay: Math.max(0, Math.floor(pay)),
    status: "idle",
    role: opts?.role,
    assigned_project_ids: [],
    hired_at: opts?.hired_at,
  };
}

export function assignAgentToProject(agent: Agent, projectId: string) {
  if (!agent.assigned_project_ids) agent.assigned_project_ids = [];
  if (!agent.assigned_project_ids.includes(projectId)) {
    agent.assigned_project_ids.push(projectId);
    agent.status = "active";
  }
  return agent;
}

export default Agent;
