// ─── Payload types ────────────────────────────────────────────────────────────
import { Project } from "@/domain/entities/Project";
export type CreateProjectPayload = Omit<
  Project,
  "id" | "views" | "created_at" | "updated_at"
>;

export type UpdateProjectPayload = Partial<Omit<Project, "id" | "created_at">>;

// ─── Lightweight card variant used in listings ────────────────────────────────

export type ProjectCard = Pick<
  Project,
  | "id"
  | "title"
  | "description"
  | "image_url"
  | "tech_stack"
  | "featured"
  | "live_url"
  | "github_url"
>;

// Project Repository Interface -----------------------------------------------------------------
export interface IProjectRepository {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  createProject(payload: CreateProjectPayload): Promise<Project>;
  updateProject(
    id: number,
    payload: UpdateProjectPayload,
  ): Promise<Project | null>;
  deleteProject(id: number): Promise<boolean>;
}
