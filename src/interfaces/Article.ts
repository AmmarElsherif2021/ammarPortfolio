import type { User } from "./User";

// ─── Entity interface (mirrors the `articles` table) ─────────────────────────

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string; // UUID FK → users.id
  author?: Pick<User, "id" | "name" | "avatar_url">; // joined relation (optional)
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

// ─── Payload types ────────────────────────────────────────────────────────────

export type CreateArticlePayload = Omit<
  Article,
  "id" | "views" | "created_at" | "updated_at" | "author"
>;

export type UpdateArticlePayload = Partial<
  Omit<Article, "id" | "created_at" | "author">
>;

// ─── Lightweight card variant used in listing / preview components ────────────

export type ArticlePreview = Pick<
  Article,
  "id" | "title" | "slug" | "excerpt" | "published" | "views" | "created_at"
> & {
  author?: Pick<User, "name" | "avatar_url">;
};