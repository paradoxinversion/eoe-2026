import { test } from "vitest";

test("perf placeholder: load 200 entities (test)", () => {
  // Minimal placeholder so CI perf step has a runnable test.
  const entities = Array.from({ length: 200 }, (_, i) => ({
    id: `entity-${i}`,
  }));
  if (entities.length !== 200) throw new Error("placeholder failed");
});
