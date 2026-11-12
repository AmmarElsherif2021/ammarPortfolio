import { Article } from '@/domain/entities/Article';
import { User } from '@/domain/entities/User';

// ─── Payload types ────────────────────────────────────────────────────────────
export type CreateArticlePayload = Omit<Article, 'id' | 'views' | 'createdAt' | 'updatedAt'>;

export type UpdateArticlePayload = Partial<Omit<Article, 'id' | 'createdAt'>>;

// ─── Lightweight card variant used in listing / preview components ────────────

export type ArticlePreview = Pick<
  Article,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'published'
  | 'views'
  | 'createdAt'
  | 'coverImage'
  | 'updatedAt'
  | 'content'
> & {
  author?: Pick<User, 'name' | 'avatar_url'>;
};
// Article Repository Interface -----------------------------------------------------------------
export interface IArticleRepository {
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  createArticle(payload: CreateArticlePayload): Promise<Article>;
  updateArticle(slug: string, payload: UpdateArticlePayload): Promise<Article | null>;
  deleteArticle(slug: string): Promise<boolean>;
}
