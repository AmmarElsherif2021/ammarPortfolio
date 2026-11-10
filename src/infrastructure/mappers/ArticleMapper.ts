// src/infrastructure/mappers/ArticleMapper.ts
import { Article } from "@/domain/entities/Article";
import { Prisma } from "@/generated/prisma/client";
import {
  IArticleRepository,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/domain/repositories/IArticleRepository";
// ─── Type helper: What Prisma returns when we include the author ──────
type PrismaArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: { author: true };
}>;

// ─── Type helper: What Prisma returns for a list (without author) ──────
type PrismaArticlePreview = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    slug: true;
    title: true;
    excerpt: true;
    coverImage: true;
    published: true;
    views: true;
    created_at: true;
    updated_at: true;
    content: true;
    author_id: true;
  };
}>;

export class ArticleMapper {
  /**
   * Converts a Prisma Article (with nested author) to a clean Domain Article.
   * Handles: Date → ISO string, null → fallback, and flattening the author relation.
   */
  static toDomain(prismaData: PrismaArticleWithAuthor): Article {
    return {
      id: prismaData.id,
      title: prismaData.title,
      slug: prismaData.slug,
      // Prisma content is optional (?), Domain expects string. Provide fallback.
      content: prismaData.content ?? "",
      excerpt: prismaData.excerpt ?? undefined,
      author_id: prismaData.author_id,
      // 🔥 Mapping the nested relation to the required shape in your Domain
      author: prismaData.author
        ? {
            id: prismaData.author.id,
            name: prismaData.author.name,
            avatar_url: prismaData.author.avatar_url ?? undefined,
          }
        : undefined,
      published: prismaData.published,
      views: prismaData.views,
      // ⚠️ CRITICAL: Convert Prisma DateTime to ISO string (domain requires string)
      created_at: prismaData.created_at.toISOString(),
      updated_at: prismaData.updated_at.toISOString(),
      coverImage: prismaData.coverImage ?? undefined,
    };
  }

  /**
   * Converts an array of Prisma Articles (with authors) to Domain Articles.
   */
  static toDomainArray(prismaData: PrismaArticleWithAuthor[]): Article[] {
    return prismaData.map((item) => this.toDomain(item));
  }

  /**
   * Maps a Domain `CreateArticlePayload` to a Prisma `create` data object.
   * The payload has `author_id` (string), which maps directly to Prisma's `author_id`.
   * It excludes: id, views, created_at, updated_at, author (nested object).
   */
  static toPrismaCreate(
    payload: CreateArticlePayload,
  ): Prisma.ArticleCreateInput {
    return {
      slug: payload.slug,
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt ?? "",
      coverImage: payload.coverImage ?? "",
      published: payload.published ?? false, // Provide default if missing
      // Prisma handles `created_at` and `updated_at` automatically via @default(now()) and @updatedAt
      // Connect the author via the relation
      author: {
        connect: { id: payload.author_id },
      },
    };
  }

  /**
   * Maps a Domain `UpdateArticlePayload` to a Prisma `update` data object.
   * Handles partial updates safely.
   */
  static toPrismaUpdate(
    payload: UpdateArticlePayload, // Import from your IArticleRepository
  ): Prisma.ArticleUpdateInput {
    const data: Prisma.ArticleUpdateInput = {};

    if (payload.title !== undefined) data.title = payload.title;
    if (payload.slug !== undefined) data.slug = payload.slug;
    if (payload.content !== undefined) data.content = payload.content;
    if (payload.excerpt !== undefined) data.excerpt = payload.excerpt;
    if (payload.coverImage !== undefined) data.coverImage = payload.coverImage;
    if (payload.published !== undefined) data.published = payload.published;
    if (payload.views !== undefined) data.views = payload.views;
    if (payload.author_id !== undefined) {
      data.author = { connect: { id: payload.author_id } };
    }
    // ⚠️ Note: We don't allow updating `id` or `created_at` from this payload.

    return data;
  }
}
