import Ajv, { ErrorObject } from "ajv";
import personSchema from "../../../../specs/003-personnel-tab/contracts/people.schema.json";
import profileSchema from "../../../../specs/003-personnel-tab/contracts/profile.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });

const validatePerson = ajv.compile(personSchema as object);
const validateProfile = ajv.compile(profileSchema as object);

export function validatePersonData(data: unknown): {
  valid: boolean;
  errors?: ErrorObject[] | null;
} {
  const valid = validatePerson(data);
  return { valid: Boolean(valid), errors: validatePerson.errors ?? null };
}

export function validateProfileData(data: unknown): {
  valid: boolean;
  errors?: ErrorObject[] | null;
} {
  const valid = validateProfile(data);
  return { valid: Boolean(valid), errors: validateProfile.errors ?? null };
}

export { validatePerson, validateProfile, personSchema, profileSchema };
