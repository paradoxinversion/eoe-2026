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
    const ag = entry.agent as AgentRecord;
    const topLeadership = (ag as any).leadership;
    const attrs = (ag as any).attributes || {};
    const hasAttrLeadership = typeof (attrs as any).leadership === "number";

    if (typeof topLeadership === "number" && !hasAttrLeadership) {
      const updated: AgentRecord = Object.assign({}, ag);
      updated.attributes = Object.assign({}, attrs, {
        leadership: topLeadership,
      });
      // remove legacy top-level leadership to avoid duplication
      delete (updated as any).leadership;
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
