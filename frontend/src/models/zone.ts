export type Zone = {
  capacity?: string;
  id: string;
  size: number;
  wealth: number;
  intelligenceLevel: number;
  name: string;
  governingOrganization?: string;
  buildings?: string[];
  people?: string[];
};

export function createZone(
  id: string,
  name: string,
  intelligenceLevel = 0,
  opts?: Partial<Pick<Zone, "governingOrganization" | "buildings" | "people">>,
): Zone {
  return {
    id,
    name,
    intelligenceLevel: Math.max(
      0,
      Math.min(100, Math.floor(intelligenceLevel)),
    ),
    governingOrganization: opts?.governingOrganization,
    buildings: opts?.buildings ?? [],
    people: opts?.people ?? [],
  };
}

export default Zone;
