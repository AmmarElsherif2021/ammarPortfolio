// ─── Entity interface (mirrors the `projects` table) ─────────────────────────

export interface Project {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  tech_stack: string[]; // e.g. ["React", "Next.js", "TypeScript"]
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

// ─── Payload types ────────────────────────────────────────────────────────────

export type CreateProjectPayload = Omit<
  Project,
  "id" | "views" | "created_at" | "updated_at"
>;

export type UpdateProjectPayload = Partial<
  Omit<Project, "id" | "created_at">
>;

// ─── Lightweight card variant used in listings ────────────────────────────────

export type ProjectCard = Pick<
  Project,
  "id" | "title" | "description" | "image_url" | "tech_stack" | "featured" | "live_url" | "github_url"
>;