export function intelligenceToConfidence(level: number): number {
  if (!Number.isFinite(level)) return 0;
  const clamped = Math.max(0, Math.min(10, Math.round(level)));
  return Math.round((clamped / 10) * 100);
}

export function computeCapacity(leadership: number): number {
  // Simple capacity rule: leadership points == subordinate slots
  if (!Number.isFinite(leadership) || leadership <= 0) return 0;
  return Math.floor(leadership);
}

export function agentTypeSummary(
  agents: Array<{ agentType?: string; role?: string }>,
) {
  const map: Record<string, number> = {};
  for (const a of agents) {
    const t = (a.role as string) || a.agentType || "Unknown";
    map[t] = (map[t] || 0) + 1;
  }
  return map;
}

type Agent = {
  id: string;
  superiorId?: string | null;
  leadership?: number;
  zoneId?: string | null;
  [k: string]: unknown;
};

export function subordinateCount(leaderId: string, agents: Agent[]): number {
  return agents.filter((a) => a.superiorId === leaderId).length;
}

export function availableCapacity(
  leader: Agent | null | undefined,
  agents: Agent[],
): number {
  if (!leader) return 0;
  const cap = computeCapacity(leader.leadership ?? 0);
  const used = subordinateCount(leader.id, agents);
  return Math.max(0, cap - used);
}

export function findEligibleSuperiors(
  excludeIds: Set<string>,
  zoneId: string | null | undefined,
  agents: Agent[],
): Agent[] {
  // Eligible superiors are agents with leadership > 0 and available capacity
  const candidates = agents.filter(
    (a) => a.leadership && a.leadership > 0 && !excludeIds.has(a.id),
  );
  // Prefer same zone first
  const sameZone = candidates.filter(
    (c) => c.zoneId === zoneId && availableCapacity(c, agents) > 0,
  );
  if (sameZone.length > 0) {
    return sameZone.sort(
      (a, b) => availableCapacity(b, agents) - availableCapacity(a, agents),
    );
  }
  const any = candidates.filter((c) => availableCapacity(c, agents) > 0);
  return any.sort(
    (a, b) => availableCapacity(b, agents) - availableCapacity(a, agents),
  );
}

export function reassignSubordinatesOnRemoval(
  superiorId: string,
  agents: Agent[],
): Agent[] {
  // Return a new array with updated superiorId for former subordinates
  const copy = agents.map((a) => ({ ...a }));
  const removed = copy.find((a) => a.id === superiorId) || null;

  // subordinates to reassign
  const subs = copy.filter((a) => a.superiorId === superiorId);

  for (const sub of subs) {
    // 1) try superior's superior
    const superiorsSuperiorId =
      removed && removed.superiorId ? removed.superiorId : null;
    if (superiorsSuperiorId) {
      const supSup = copy.find((a) => a.id === superiorsSuperiorId) || null;
      if (supSup && availableCapacity(supSup, copy) > 0) {
        sub.superiorId = supSup.id;
        continue;
      }
    }

    // 2) try other superiors in same zone
    const zone = removed ? removed.zoneId : sub.zoneId;
    const exclude = new Set<string>([superiorId]);
    const elig = findEligibleSuperiors(exclude, zone, copy);
    if (elig.length > 0) {
      sub.superiorId = elig[0].id;
      continue;
    }

    // 3) mark as unassigned (null)
    sub.superiorId = null;
  }

  return copy;
}
