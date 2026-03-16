// Client-side fetch helpers
export async function fetchProjects() {
  const res = await fetch('/api/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function fetchArticles() {
  const res = await fetch('/api/articles')
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function fetchArticle(slug: string) {
  const res = await fetch(`/api/articles/${slug}`)
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

export async function submitContact(data: {
  name: string
  email: string
  message: string
  subject: string
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit contact')
  return res.json()
}