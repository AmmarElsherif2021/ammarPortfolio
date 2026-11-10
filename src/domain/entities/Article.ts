import type { User } from "./User";

// ─── Entity interface (mirrors the `articles` table) ─────────────────────────

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string; //FK -- users.id
  author?: Pick<User, "id" | "name" | "avatar_url">;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  coverImage?: string; // URL of cover image
}
