import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/_components/alert";
import Container from "@/_components/container";
import Header from "@/_components/header";
import { PostBody } from "@/_components/post-body";
import { PostHeader } from "@/_components/post-header";
import { Article } from "@/domain/entities/Article";
export default async function ArticlePage(props: Params) {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return notFound();
  }

  const content = await markdownToHtml(article.content || "");

  return (
    <main>
      <Alert preview={true} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={article.title}
            coverImage={article.coverImage}
            date={article.created_at}
            author={article.author as any}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return notFound();
  }

  const title = `${article.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: [article.coverImage || ""],
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();

  return (await articles).map((article: Article) => ({
    slug: article.slug,
  }));
}
