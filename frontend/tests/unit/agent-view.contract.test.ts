import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import { render } from "@testing-library/react";
import Profile from "../../../frontend/src/components/personnel/Profile";

const schemaPath = path.resolve(
  __dirname,
  "../../../../specs/004-initial-agents/contracts/agent-view.json",
);

describe("AgentView contract", () => {
  let schema: any;
  let ajv: Ajv;

  beforeAll(async () => {
    const raw = await fs.readFile(schemaPath, "utf8");
    schema = JSON.parse(raw);
    ajv = new Ajv();
  });

  test("valid AgentView passes schema validation", () => {
    const agentView = {
      agentId: "ag-1",
      role: "Scout",
      person: {
        id: "p-1",
        firstName: "Jane",
        lastName: "Doe",
        homeZoneId: "zone-1",
        skills: { scouting: 3 },
        attributes: { strength: 5 },
      },
    };

    const validate = ajv.compile(schema);
    const ok = validate(agentView);
    if (!ok) {
      // include validation errors for debugging
      // eslint-disable-next-line no-console
      console.error(validate.errors);
    }
    expect(ok).toBe(true);
  });

  test("Profile component accepts props that map to AgentView.person", () => {
    const person = {
      id: "p-2",
      firstName: "Play",
      lastName: "Test",
      homeZoneId: "zone-test",
      intelligenceLevel: 42,
      attributes: { health: 10 },
      skills: { fighting: 2 },
    } as any;

    const { getByTestId, getByText } = render(<Profile person={person} />);
    expect(getByTestId("person-name").textContent).toContain("Play Test");
    // ensure Origin label cell is present
    expect(getByText("Origin")).toBeTruthy();
  });

  test("missing required person fields should fail schema validation", () => {
    const bad = {
      agentId: "ag-2",
      person: {
        id: "p-3",
        // missing firstName/lastName/homeZoneId
      },
    };
    const validate = ajv.compile(schema);
    const ok = validate(bad);
    expect(ok).toBe(false);
  });
});
