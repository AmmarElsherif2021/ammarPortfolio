import { ArticlePreview } from '@/domain/entities/Article';
import ArticleCard from './article-card';

type Props = {
  articles: ArticlePreview[];
};

export function MoreStories({ articles }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles &&
          articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </section>
  );
}
