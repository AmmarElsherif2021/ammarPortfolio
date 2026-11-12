import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/../prisma/client';
import { CMS_NAME } from '@/lib/constants';
import markdownToHtml from '@/lib/markdownToHtml';
import Alert from '@/_components/alert';
import Container from '@/_components/container';
import Header from '@/_components/header';
import { ArticleBody } from '@/_components/article-body';
import { ArticleHeader } from '@/_components/article-header';

// ISR
export const revalidate = 60;

type Params = {
  params: Promise<{ slug: string }>;
};

// Generate static parameters for the article page
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage(props: Params) {
  const { slug } = await props.params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!article || !article.published) {
    notFound();
  }

  const content = await markdownToHtml(article.content ?? '');

  return (
    <main>
      <Alert preview={true} />
      <Container>
        <Header />
        <article className="mb-32">
          <ArticleHeader
            title={article.title}
            coverImage={article.coverImage ?? ''}
            date={article.created_at.toISOString()}
            author={
              article.author
                ? {
                    id: article.author.id,
                    name: article.author.name,
                    avatar_url: article.author.avatar_url,
                  }
                : undefined
            }
          />
          <ArticleBody content={content} />
        </article>
      </Container>
    </main>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { slug } = await props.params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, coverImage: true },
  });

  if (!article) {
    notFound(); // throws NEXT_NOT_FOUND; no return needed
  }

  const title = `${article.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: [article.coverImage ?? ''],
    },
  };
}
