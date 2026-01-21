export type Zone = {
  id: string;
  gridX: number;
  gridY: number;
  name: string;
  size?: number;
  wealth: number;
  intelligenceLevel: number;
  capacity?: string;
  governingOrganization?: string;
  buildings?: string[];
  people?: string[];
};

export function createZone(
  id: string,
  gridX: number,
  gridY: number,
  name: string,
  intelligenceLevel = 0,
  opts?: Partial<
    Pick<
      Zone,
      "governingOrganization" | "buildings" | "people" | "size" | "wealth"
    >
  >,
): Zone {
  return {
    id,
    gridX,
    gridY,
    name,
    size: opts?.size ?? 1,
    wealth: opts?.wealth ?? 0,
    intelligenceLevel: Math.max(
      0,
      Math.min(100, Math.floor(intelligenceLevel)),
    ),
    capacity: opts?.capacity,
    governingOrganization: opts?.governingOrganization,
    buildings: opts?.buildings ?? [],
    people: opts?.people ?? [],
  };
}

export default Zone;
