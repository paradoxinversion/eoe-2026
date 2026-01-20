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
      // zone size bounds validation: min >= 1, max >= min
      const zMin =
        typeof d.zoneSizeMin === "number"
          ? Math.floor(d.zoneSizeMin)
          : undefined;
      const zMax =
        typeof d.zoneSizeMax === "number"
          ? Math.floor(d.zoneSizeMax)
          : undefined;
      if (typeof zMin === "number") {
        if (zMin < 1) {
          const err: Ajv.ErrorObject = {
            instancePath: "/zoneSizeMin",
            schemaPath: "#/properties/zoneSizeMin",
            keyword: "minimum",
            params: { comparison: ">=", limit: 1 },
            message: `must be >= 1`,
          } as Ajv.ErrorObject;
          errors = errors ? errors.concat(err) : [err];
        }
      }
      if (typeof zMax === "number" && typeof zMin === "number") {
        if (zMax < zMin) {
          const err: Ajv.ErrorObject = {
            instancePath: "/zoneSizeMax",
            schemaPath: "#/properties/zoneSizeMax",
            keyword: "minimum",
            params: { comparison: ">=", limit: zMin },
            message: `must be >= zoneSizeMin (${zMin})`,
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
