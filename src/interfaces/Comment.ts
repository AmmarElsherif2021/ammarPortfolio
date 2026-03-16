import type { User } from "./User";

// ─── Entity interface (mirrors the `comments` table) ─────────────────────────

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

// ─── Payload types ────────────────────────────────────────────────────────────

export type CreateCommentPayload = Pick<
  Comment,
  "content" | "author_id" | "article_id"
>;

export type UpdateCommentPayload = Partial<Pick<Comment, "content" | "approved">>;