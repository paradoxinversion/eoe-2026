export type Person = {
  id: string;
  name: string;
  role?: string;
  pay: number;
  attributes?: Record<string, unknown>;
};

export function createPerson(
  id: string,
  name: string,
  pay = 0,
  opts?: Partial<Pick<Person, "role" | "attributes">>,
): Person {
  return {
    id,
    name,
    pay: Math.max(0, Math.floor(pay)),
    role: opts?.role,
    attributes: opts?.attributes ?? {},
  };
}

export default Person;
