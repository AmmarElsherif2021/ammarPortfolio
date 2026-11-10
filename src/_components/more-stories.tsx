import { ArticlePreview } from "@/domain/entities/Article";
import ArticleCard from "./article-card";

type Props = {
  posts: ArticlePreview[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts &&
          posts.map((post) => <ArticleCard key={post.slug} article={post} />)}
      </div>
    </section>
  );
}
