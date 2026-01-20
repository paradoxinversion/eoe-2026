import Ajv from "ajv";
import schema from "../../../specs/001-empire-game-spec/contracts/config-schema.json";

const ajv = new Ajv({ allErrors: true, verbose: true });
import addFormats from "ajv-formats";
addFormats(ajv);
const validate = ajv.compile(schema as object);

export type ValidationResult = {
  valid: boolean;
  errors?: Ajv.ErrorObject[] | null;
};

export function validateConfig(data: unknown): ValidationResult {
  const valid = validate(data);
  // Start with AJV errors if any
  let errors: Ajv.ErrorObject[] | null = validate.errors
    ? [...(validate.errors as Ajv.ErrorObject[])]
    : null;

  // Additional rule: organizationCount must be less than total map cells (mapWidth * mapHeight)
  try {
    if (data && typeof data === "object") {
      const d = data as Record<string, any>;
      const mapW =
        typeof d.mapWidth === "number" ? Math.floor(d.mapWidth) : undefined;
      const mapH =
        typeof d.mapHeight === "number" ? Math.floor(d.mapHeight) : undefined;
      const orgCount =
        typeof d.organizationCount === "number"
          ? Math.floor(d.organizationCount)
          : undefined;
      if (
        typeof mapW === "number" &&
        typeof mapH === "number" &&
        typeof orgCount === "number"
      ) {
        const total = mapW * mapH;
        if (!(orgCount < total)) {
          const err: Ajv.ErrorObject = {
            instancePath: "/organizationCount",
            schemaPath: "#/properties/organizationCount",
            keyword: "maximum",
            params: { comparison: "<", limit: total },
            message: `must be less than total map cells (${total})`,
          } as Ajv.ErrorObject;
          errors = errors ? errors.concat(err) : [err];
        }
      }
    }
  } catch (e) {
    // swallow and return existing validation result
  }

  return { valid: !errors || errors.length === 0, errors };
}

export default validateConfig;
