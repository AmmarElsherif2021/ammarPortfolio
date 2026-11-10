import type { User } from "./User";

//POSTBONED! ─── Entity interface (mirrors the `comments` table) ─────────────────────────

export interface Comment {
  id: number;
  content: string;
  author_id: string; // UUID FK → users.id
  author?: Pick<User, "id" | "name" | "avatar_url">; // joined relation (optional)
  article_id: number; // FK → articles.id (CASCADE DELETE)
  approved: boolean;
  created_at: string;
  updated_at: string;
}
