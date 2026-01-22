import personnelPersistence, {
  AgentRecord,
} from "../../services/personnelPersistence";

export async function migrateLeadershipInAgents(): Promise<{
  migrated: number;
  skipped: number;
}> {
  const list = await personnelPersistence.listAgents();
  let migrated = 0;
  let skipped = 0;

  for (const entry of list) {
    const ag = entry.agent as AgentRecord & {
      attributes?: Record<string, unknown>;
    };
    const topLeadership =
      typeof ag.leadership === "number" ? (ag.leadership as number) : undefined;
    const attrs = ag.attributes || {};
    const hasAttrLeadership = typeof attrs.leadership === "number";

    if (typeof topLeadership === "number" && !hasAttrLeadership) {
      const updated: AgentRecord & { attributes?: Record<string, unknown> } =
        Object.assign({}, ag);
      updated.attributes = Object.assign({}, attrs, {
        leadership: topLeadership,
      });
      // remove legacy top-level leadership to avoid duplication
      delete (updated as unknown as Record<string, unknown>).leadership;
      await personnelPersistence.saveAgent(updated);
      migrated++;
    } else {
      skipped++;
    }
  }

  // eslint-disable-next-line no-console
  console.info(
    `migrateLeadershipInAgents: migrated=${migrated} skipped=${skipped}`,
  );
  return { migrated, skipped };
}

export default migrateLeadershipInAgents;
