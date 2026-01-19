import type { UUID } from "./person";

export interface GoverningOrganization {
  id: UUID;
  name: string;
  type?: string;
  leaderId?: UUID;
}

export default GoverningOrganization;
