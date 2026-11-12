import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Helper: Generate a unique slug ──────────────────────────────
function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) +
    '-' +
    faker.string.alphanumeric(6)
  );
}
async function main() {
  console.warn('Starting database seeding...');

  // ─── 1. Clean up existing data ────────────────────────────────
  await prisma.article.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
  console.warn('Cleared existing data.');

  // ─── 2. Create a default Author (User) ────────────────────────
  const author = await prisma.user.create({
    data: {
      name: 'Ammar Ali',
      avatar_url: faker.image.avatarGitHub(),
      role: 'ADMIN',
      created_at: faker.date.past({ years: 2 }),
    },
  });
  console.warn(`Created user: ${author.name} (ID: ${author.id})`);

  // ─── 3. Seed Articles ──────────────────────────────────────────
  const articlesData = Array.from({ length: 8 }, () => {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    return {
      slug: generateSlug(title),
      title: title,
      excerpt: faker.lorem.sentences({ min: 1, max: 2 }),
      content: faker.lorem.paragraphs({ min: 3, max: 8 }),
      coverImage: faker.image.urlPicsumPhotos({ width: 1200, height: 630 }),
      published: faker.datatype.boolean({ probability: 0.8 }),
      views: faker.number.int({ min: 0, max: 1000 }),
      created_at: faker.date.between({ from: '2024-01-01', to: new Date() }),
      updated_at: new Date(),
      author_id: author.id,
    };
  });

  for (const article of articlesData) {
    await prisma.article.create({ data: article });
  }
  console.warn(`Created ${articlesData.length} articles.`);

  // ─── 4. Seed Projects ──────────────────────────────────────────
  const techStacks = [
    ['React', 'TypeScript', 'Next.js'],
    ['Node.js', 'Express', 'PostgreSQL'],
    ['Python', 'Django', 'PostgreSQL'],
    ['React Native', 'Expo', 'Firebase'],
    ['Vue', 'Nuxt', 'Tailwind'],
    ['C#', '.NET', 'SQL Server'],
  ];

  const projectsData = Array.from({ length: 6 }, (_, index) => {
    const title = faker.commerce.productName();
    const tech = techStacks[index % techStacks.length];

    return {
      title: title,
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      image_url: faker.image.urlPicsumPhotos({ width: 800, height: 500 }),
      tech_stack: tech,
      featured: faker.datatype.boolean({ probability: 0.3 }),
      live_url: faker.internet.url(),
      github_url: faker.internet.url({ appendSlash: false }),
      views: faker.number.int({ min: 0, max: 500 }),
      created_at: faker.date.between({ from: '2024-01-01', to: new Date() }),
      updated_at: new Date(),
    };
  });

  for (const project of projectsData) {
    await prisma.project.create({ data: project });
  }
  console.warn(`Created ${projectsData.length} projects.`);

  console.warn('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
