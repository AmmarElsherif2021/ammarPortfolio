import Avatar from './avatar';
import CoverImage from './cover-image';
import DateFormatter from './date-formatter';
import { ArticleTitle } from '@/_components/article-title';

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
};

export function ArticleHeader({ title, coverImage, date, author }: Props) {
  return (
    <>
      <ArticleTitle>{title}</ArticleTitle>

      {author && (
        <div className="hidden md:block md:mb-8">
          <Avatar name={author.name} picture={author.avatar_url} />
        </div>
      )}

      <div className="mb-8 md:mb-16 sm:mx-0 border border-port-dark/30 overflow-hidden rounded-none">
        <CoverImage title={title} src={coverImage} />
      </div>

      <div className="max-w-2xl mx-auto">
        {author && (
          <div className="block md:hidden mb-6">
            <Avatar name={author.name} picture={author.avatar_url} />
          </div>
        )}

        <div className="mb-8 pt-4 border-t border-port-dark/20 flex items-center gap-3">
          <span className="port-label-colorful px-2 py-0 text-[11px] rounded-none">Published</span>
          <span className="port-body2 text-port-dark">
            <DateFormatter dateString={date} />
          </span>
        </div>
      </div>
    </>
  );
}
