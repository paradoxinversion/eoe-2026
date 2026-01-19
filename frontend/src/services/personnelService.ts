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

export function agentTypeSummary(agents: Array<{ agentType?: string }>) {
  const map: Record<string, number> = {};
  for (const a of agents) {
    const t = a.agentType || "Unknown";
    map[t] = (map[t] || 0) + 1;
  }
  return map;
}
