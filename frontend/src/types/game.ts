export interface PersonLike {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  homeZoneId?: string;
  zoneId?: string;
  intelligenceLevel?: number;
  leadership?: number;
  pay?: number;
  status?: string;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface AgentLike {
  id?: string;
  agentId?: string;
  personId?: string;
  person_id?: string;
  codename?: string;
  codeName?: string;
  name?: string;
  role?: string;
  agentType?: string;
  type?: string;
  leadership?: number;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  homeZoneId?: string;
  [k: string]: unknown;
}

export interface ZoneLike {
  id?: string;
  name?: string;
  currentOccupants?: string[] | string | number;
  people?: string[] | Array<PersonLike>;
  [k: string]: unknown;
}

export interface ArtifactLike {
  agents?: AgentLike[];
  people?: PersonLike[];
  zones?: ZoneLike[];
  [k: string]: unknown;
}

export type GameState =
  | { world?: { artifact?: ArtifactLike } }
  | ArtifactLike
  | Record<string, unknown>;

export function artifactFromState(s: unknown): ArtifactLike | undefined {
  if (!s || typeof s !== "object" || s === null) return undefined;
  const ss = s as Record<string, unknown>;
  if (ss.world && typeof ss.world === "object" && ss.world !== null) {
    const world = ss.world as Record<string, unknown>;
    if (
      world.artifact &&
      typeof world.artifact === "object" &&
      world.artifact !== null
    ) {
      return world.artifact as ArtifactLike;
    }
  }
  // If shape looks like an artifact, return it
  if (ss.agents || ss.people || ss.zones) return ss as ArtifactLike;
  return undefined;
}
