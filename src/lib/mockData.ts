import { ArticlePreview } from '@/domain/entities/Article';
import { ProjectCard } from '@/domain/entities/Project';

export const mockArticles: ArticlePreview[] = [
  {
    id: '1',
    title: 'Dynamic Routing in Next.js 15',
    slug: 'dynamic-routing',
    excerpt: 'Learn how to leverage dynamic routes and catch‑all segments in App Router.',
    //content: 'An in-depth guide to dynamic routing and catch-all routes in Next.js App Router.',
    //published: true,
    //views: 1240,
    createdAt: '2026-01-10T10:00:00Z',
    coverImage: '/assets/blog/dynamic-routing/cover.jpg',
    //authorId: 'user1',
    //updatedAt: '2026-01-10T10:00:00Z',
    author: {
      id: 'user1',
      name: 'Ammar Elsherif',
      avatar_url: '/assets/blog/authors/jj.jpeg',
    },
  },
  {
    id: '2',
    title: 'Hello World: A Fresh Start',
    slug: 'hello-world',
    excerpt: 'Every journey begins with a single step – here is mine.',
    //content: 'Personal introduction and goals for this blog — building in public.',
    //published: true,
    //views: 856,
    createdAt: '2026-01-05T08:30:00Z',
    coverImage: '/assets/blog/hello-world/cover.jpg',
    //authorId: 'user1',
    //updatedAt: '2026-01-05T08:30:00Z',
    author: {
      id: 'user1',
      name: 'Ammar Elsherif',
      avatar_url: '/assets/blog/authors/jj.jpeg',
    },
  },
  {
    id: '3',
    title: 'Preview Mode for Static Sites',
    slug: 'preview',
    excerpt: 'Enable live preview of draft content without rebuilding your entire site.',
    //content: 'How to set up preview mode to view draft content on your static site.',
    //published: false,
    //views: 321,
    createdAt: '2026-01-02T14:15:00Z',
    coverImage: '/assets/blog/preview/cover.jpg',
    //authorId: 'user1',
    //updatedAt: '2026-01-02T14:15:00Z',
    author: {
      id: 'user1',
      name: 'Ammar Elsherif',
      avatar_url: '/assets/blog/authors/jj.jpeg',
    },
  },
];

export const mockProjects: ProjectCard[] = [
  {
    id: 1,
    title: 'TaskTrone – 3D Task Manager',
    description: 'A futuristic task manager powered by Three.js and WebGL.',
    image_url: '/assets/GIFs/cube.GIF', // or a screenshot URL
    tech_stack: ['React', 'Three.js', 'TypeScript'],
    featured: true,
    live_url: 'https://tasktrone.vercel.app',
    github_url: 'https://github.com/ammar/tasktrone',
  },
  {
    id: 2,
    title: 'Earth Explorer',
    description: 'Interactive 3D globe with real‑time weather data.',
    image_url: '/assets/GIFs/cube.GIF',
    tech_stack: ['Next.js', 'D3.js', 'WebGL'],
    featured: false,
    live_url: 'https://earth-explorer.vercel.app',
    github_url: 'https://github.com/ammar/earth-explorer',
  },
  {
    id: 3,
    title: 'Rocket Launcher Dashboard',
    description: 'Monitor launch status and telemetry in real time.',
    image_url: '/assets/GIFs/cube.GIF',
    tech_stack: ['React', 'Firebase', 'Chart.js'],
    featured: false,
    live_url: 'https://rocket-dash.vercel.app',
    github_url: 'https://github.com/ammar/rocket-dash',
  },
];
