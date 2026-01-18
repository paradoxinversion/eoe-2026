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
    return { valid: Boolean(valid), errors: validate.errors };
}

export default validateConfig;
