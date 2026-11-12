import { Article } from '@/domain/entities/Article';
////MOCK DATA FETCHING (for testing purposes)
export async function fetchMockArticle(slug: string): Promise<Article> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: '1',
    title: 'Mock Article Title',
    slug,
    content: 'This is the content of the mock article.',
    excerpt: 'This is a mock excerpt.',
    author: {
      id: '1',
      name: 'Mock Author',
      avatar_url: 'https://example.com/avatar.jpg',
    },
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverImage: undefined,
  };
}
// getAllArticles and getArticleBySlug can be modified to use mock data for testing purposes
export function getAllMockArticles(): Promise<Article[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Mock Article 1',
          slug: 'mock-article-1',
          content: 'This is the content of mock article 1.',
          excerpt: 'This is a mock excerpt for article 1.',
          author: {
            id: '1',
            name: 'Mock Author',
            avatar_url: 'https://example.com/avatar.jpg',
          },
          published: true,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          coverImage: undefined,
        },
        {
          id: '2',
          title: 'Mock Article 2',
          slug: 'mock-article-2',
          content: 'This is the content of mock article 2.',
          excerpt: 'This is a mock excerpt for article 2.',
          author: {
            id: '2',
            name: 'Mock Author 2',
            avatar_url: 'https://example.com/avatar2.jpg',
          },
          published: true,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          coverImage: undefined,
        },
      ]);
    }, 1000);
  });
}

export function getMockArticleBySlug(slug: string): Promise<Article | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockArticles = [
        {
          id: '1',
          title: 'Mock Article 1',
          slug: 'mock-article-1',
          content: 'This is the content of mock article 1.',
          excerpt: 'This is a mock excerpt for article 1.',
          author: {
            id: '1',
            name: 'Mock Author',
            avatar_url: 'https://example.com/avatar.jpg',
          },
          published: true,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          coverImage: undefined,
        },
      ];
      resolve(mockArticles.find((article) => article.slug === slug));
    }, 1000);
  });
}
