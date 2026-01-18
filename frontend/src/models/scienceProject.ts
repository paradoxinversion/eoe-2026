export type ScienceProjectStatus =
  | "queued"
  | "active"
  | "completed"
  | "cancelled";

export type ScienceProject = {
  id: string;
  name: string;
  required_science: number;
  status: ScienceProjectStatus;
  assigned_scientists: string[]; // agent ids
  lab_modifiers?: Record<string, number>;
  progress_days: number;
  base_duration_days: number;
  // reserved_science stores how much science has been reserved up-front for this project
  reserved_science?: number;
};

export function createScienceProject(
  id: string,
  name: string,
  required_science: number,
  base_duration_days = 7,
  opts?: Partial<Pick<ScienceProject, "lab_modifiers">>,
): ScienceProject {
  return {
    id,
    name,
    required_science: Math.max(0, Math.floor(required_science)),
    status: "queued",
    assigned_scientists: [],
    lab_modifiers: opts?.lab_modifiers ?? {},
    progress_days: 0,
    base_duration_days: Math.max(1, Math.floor(base_duration_days)),
  };
}

export function assignScientist(project: ScienceProject, agentId: string) {
  if (!project.assigned_scientists.includes(agentId)) {
    project.assigned_scientists.push(agentId);
    if (project.status === "queued") project.status = "active";
  }
  return project;
}

export function progressProjectOneDay(project: ScienceProject) {
  // naive progress model: each assigned scientist contributes 1 day-equivalent
  if (project.status !== "active") return project;
  project.progress_days += Math.max(0, project.assigned_scientists.length);
  if (project.progress_days >= project.base_duration_days) {
    project.status = "completed";
  }
  return project;
}

export default ScienceProject;
