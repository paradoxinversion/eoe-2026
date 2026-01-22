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

export function artifactFromState(s: GameState): ArtifactLike | undefined {
  if (!s) return undefined;
  if ((s as any).world && (s as any).world.artifact)
    return (s as any).world.artifact as ArtifactLike;
  return s as ArtifactLike;
}
