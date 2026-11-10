import { Article } from "@/domain/entities/Article";

// Client-side fetch helpers
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function fetchProjects() {
  const res = await fetch(`${getBaseUrl()}/api/projects`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${getBaseUrl()}/api/articles`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchArticle(slug: string): Promise<Article> {
  const res = await fetch(`${getBaseUrl()}/api/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

// submitContact is always called from the client (a form submit),
// so a relative URL is safe here — no change needed.
export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
  subject: string;
}) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit contact");
  return res.json();
}
export function getAllArticles() {
  return fetchArticles();
}
export function getArticleBySlug(slug: string) {
  return fetchArticle(slug);
}
