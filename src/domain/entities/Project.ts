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
