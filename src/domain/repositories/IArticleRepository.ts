import { Article } from "@/domain/entities/Article";
import { User } from "@/domain/entities/User";

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
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "published"
  | "views"
  | "created_at"
  | "coverImage"
  | "author_id"
  | "updated_at"
  | "content"
> & {
  author?: Pick<User, "name" | "avatar_url">;
};
// Article Repository Interface -----------------------------------------------------------------
export interface IArticleRepository {
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  createArticle(payload: CreateArticlePayload): Promise<Article>;
  updateArticle(
    slug: string,
    payload: UpdateArticlePayload,
  ): Promise<Article | null>;
  deleteArticle(slug: string): Promise<boolean>;
}
