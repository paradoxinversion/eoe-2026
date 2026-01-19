import type { UUID } from "./person";

export type BuildingType = "Residence" | "Office" | "Lab" | "Bank" | "Hospital";

export interface Building {
  id: UUID;
  name: string;
  type: BuildingType;
  size: number;
  zoneId: UUID;
  intelligenceLevel: number;
  upkeepCost: number;
  infrastructureLoad: number;
}

export default Building;
