import "../../../../node_modules/regenerator-runtime/runtime.js";
import { migrateLeadershipInAgents } from "./migrateLeadership";

async function run() {
  try {
    const res = await migrateLeadershipInAgents();
    // eslint-disable-next-line no-console
    console.log("Migration complete:", res);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Migration failed", e);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void run();
}

export {};
