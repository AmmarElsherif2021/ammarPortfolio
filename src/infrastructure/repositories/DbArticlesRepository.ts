import { prisma } from "../../../prisma/client";
import {
  IArticleRepository,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/domain/repositories/IArticleRepository";
import { Article } from "@/domain/entities/Article";
import { ArticleMapper } from "@/infrastructure/mappers/ArticleMapper";

export class DbArticlesRepository implements IArticleRepository {
  async getAllArticles(): Promise<Article[]> {
    const results = await prisma.article.findMany({
      include: { author: true },
      orderBy: { created_at: "desc" },
    });
    // 🔥 Clean mapping in one line
    return ArticleMapper.toDomainArray(results);
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const result = await prisma.article.findUnique({
      where: { slug },
      include: { author: true },
    });
    return result ? ArticleMapper.toDomain(result) : null;
  }

  async createArticle(payload: CreateArticlePayload): Promise<Article> {
    const created = await prisma.article.create({
      data: ArticleMapper.toPrismaCreate(payload),
      include: { author: true },
    });
    return ArticleMapper.toDomain(created);
  }

  async updateArticle(
    slug: string,
    payload: UpdateArticlePayload,
  ): Promise<Article | null> {
    const updated = await prisma.article.update({
      where: { slug },
      data: ArticleMapper.toPrismaUpdate(payload),
      include: { author: true },
    });
    return ArticleMapper.toDomain(updated);
  }

  async deleteArticle(slug: string): Promise<boolean> {
    try {
      await prisma.article.delete({ where: { slug } });
      return true;
    } catch {
      return false;
    }
  }
}
