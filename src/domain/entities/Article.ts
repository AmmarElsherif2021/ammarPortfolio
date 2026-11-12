import type { User } from './User';

// ─── Entity interface (mirrors the `articles` table) ─────────────────────────

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  //authorId: string; //FK -- users.id
  author?: Pick<User, 'id' | 'name' | 'avatar_url'>;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  coverImage?: string; // URL of cover image
}

export type ArticlePreview = Pick<
  Article,
  'id' | 'title' | 'slug' | 'excerpt' | 'author' | 'createdAt' | 'coverImage'
>;
