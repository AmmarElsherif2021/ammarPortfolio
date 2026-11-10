import Avatar from "@/_components/avatar";
import CoverImage from "@/_components/cover-image";
import { type ArticlePreview } from "@/domain/entities/Article";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  article: ArticlePreview;
};

export function ArticleCard({ article }: Props) {
  const { title, slug, excerpt, created_at, coverImage, author } = article;

  return (
    <article className="retro-card flex flex-col h-full">
      {/* Cover image */}
      <div className="relative w-full h-44 bg-retro-deep diag-stripe">
        {coverImage ? (
          <CoverImage title={title} src={coverImage} slug={slug} />
        ) : (
          <div className="flex items-center justify-center h-full text-retro-cream/50 font-mono text-retro-xs uppercase tracking-widest">
            Cover
          </div>
        )}
      </div>

      <div className="retro-card-body flex flex-col gap-3 flex-1">
        <span className="font-mono text-retro-xs uppercase tracking-wider opacity-60">
          <DateFormatter dateString={created_at} />
        </span>

        <h3 className="font-display text-retro-lg font-black leading-tight text-retro-ink">
          <Link
            href={`/posts/${slug}`}
            className="no-underline hover:opacity-70 transition-opacity"
          >
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="font-body text-retro-base text-retro-ink/80 line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 border-t-2 border-retro-ink/20">
          <Avatar
            name={author?.name ?? "Ammar Elsherif"}
            picture={author?.avatar_url ?? null}
          />
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
