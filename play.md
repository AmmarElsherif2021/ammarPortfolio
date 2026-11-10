## Proposed MVC Adaptation for Decoupled Data Layer

current project tightly couples Supabase to API routes and possibly server components. To detach it and support a local PostgreSQL (or any remote data source), you need to **separate concerns** using a layered architecture. The **Model‑View‑Controller (MVC)** pattern is a natural fit:

- **View** – React components (pages and UI) that render data.
- **Controller** – Next.js API routes (or Server Actions) that handle HTTP requests, validate input, and invoke the service layer.
- **Model** – The data layer, comprising **domain entities** (business objects), **repositories** (data access abstractions), and **services** (business logic).

By introducing interfaces for repositories, you can swap implementations (PostgreSQL, Supabase, mock, filesystem) without affecting the rest of your application.

---

### 1. Current Pain Points

- `src/lib/supabaseClient.ts` is imported directly in API routes and possibly in pages.
- Business logic is mixed with database access (e.g., `supabase.from('articles').select(...)` inside route handlers).
- No clear boundary between data retrieval and the rest of the application – making replacement difficult.

---

### 2. Revised Folder Structure (Suggested Additions)

Retain existing folders but introduce new ones to enforce separation:

```
src/
├── app/                    # Views and Controllers (Next.js routes)
│   ├── api/                # Controllers (API route handlers)
│   │   ├── articles/
│   │   ├── projects/
│   │   └── contact/
│   └── (pages)             # Views (page.tsx)
├── components/             # Reusable UI (Views)
├── domain/                 # Model (business entities)
│   ├── entities/           # Domain interfaces (Article, Project, User, etc.)
│   ├── services/           # Application services (business logic)
│   │   ├── ArticleService.ts
│   │   ├── ProjectService.ts
│   │   └── ContactService.ts
│   └── repositories/       # Repository interfaces (abstractions)
│       ├── IArticleRepository.ts
│       ├── IProjectRepository.ts
│       └── IContactRepository.ts
├── infrastructure/         # Data layer implementations
│   ├── db/                 # Database client setup (Prisma/Drizzle)
│   │   └── client.ts
│   ├── repositories/       # Concrete repository implementations
│   │   ├── PostgresArticleRepository.ts
│   │   ├── PostgresProjectRepository.ts
│   │   ├── PostgresContactRepository.ts
│   │   ├── FileSystemArticleRepository.ts  (if you keep markdown posts)
│   │   └── MockArticleRepository.ts        (for testing)
│   └── config/             # Environment and configuration
└── lib/                    # Existing utilities (markdown, fonts, etc.)
```

**Notes:**

- The `domain/` folder is independent of any infrastructure (PostgreSQL, Supabase). It contains pure TypeScript interfaces and business rules.
- The `infrastructure/` folder holds concrete implementations that depend on external libraries (Prisma, PostgreSQL driver) and implement the repository interfaces defined in `domain/`.
- Services (in `domain/services/`) orchestrate repositories and contain application-specific logic (e.g., validating a contact message before saving).

---

### 3. Detailed Implementation Steps

#### 3.1. Define Repository Interfaces

Example for articles:

```typescript
// src/domain/repositories/IArticleRepository.ts
import { Article } from "@/domain/entities/Article";

export interface IArticleRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  create(article: Omit<Article, "id">): Promise<Article>;
  update(id: string, article: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
}
```

Similarly for `IProjectRepository`, `IContactRepository` (for storing contact submissions).

#### 3.2. Implement PostgreSQL Repositories

Use **Prisma** (or Drizzle) to interact with your local PostgreSQL database.

```typescript
// src/infrastructure/db/client.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

```typescript
// src/infrastructure/repositories/PostgresArticleRepository.ts
import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { Article } from "@/domain/entities/Article";
import { prisma } from "../db/client";

export class PostgresArticleRepository implements IArticleRepository {
  async findAll(): Promise<Article[]> {
    const records = await prisma.article.findMany();
    return records.map(/* map Prisma model to domain entity */);
  }
  // ... implement other methods
}
```

> **Mapping**: If your domain entity differs from the Prisma model, create a mapping function in the repository (or use a separate mapper layer). This keeps your domain clean.

#### 3.3. Create Services

Services use the repository interfaces and contain business logic.

```typescript
// src/domain/services/ArticleService.ts
import { IArticleRepository } from "../repositories/IArticleRepository";
import { Article } from "../entities/Article";

export class ArticleService {
  constructor(private articleRepo: IArticleRepository) {}

  async getArticleBySlug(slug: string): Promise<Article | null> {
    // Add any business validation, caching, or logging here
    return this.articleRepo.findBySlug(slug);
  }

  async createArticle(articleData: Omit<Article, "id">): Promise<Article> {
    // e.g., ensure slug is unique, sanitise content, etc.
    return this.articleRepo.create(articleData);
  }
}
```

#### 3.4. Wire Up Dependencies (Dependency Injection)

You can use a simple **factory** pattern or a lightweight DI container. For simplicity, create a service factory that instantiates repositories and services.

```typescript
// src/infrastructure/di/container.ts
import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { PostgresArticleRepository } from "../repositories/PostgresArticleRepository";
import { ArticleService } from "@/domain/services/ArticleService";

// You can also use environment variables to decide which implementation to use
const articleRepo: IArticleRepository = new PostgresArticleRepository();

export const articleService = new ArticleService(articleRepo);
// Export other services similarly
```

#### 3.5. Update API Routes (Controllers)

API route handlers now act as **controllers**. They receive requests, call the appropriate service, and send responses.

```typescript
// src/app/api/articles/[slug]/route.ts
import { NextResponse } from "next/server";
import { articleService } from "@/infrastructure/di/container";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;
  const article = await articleService.getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}
```

> Other API routes (projects, contact) follow the same pattern.

#### 3.6. Use Services in Server Components (Views)

Next.js server components can also consume services directly (since they run on the server). This avoids unnecessary API calls and keeps the MVC separation clear – the component is the View, and it calls the Service (Model) via a controller-like function.

```tsx
// src/app/articles/[slug]/page.tsx
import { articleService } from "@/infrastructure/di/container";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await articleService.getArticleBySlug(params.slug);
  if (!article) {
    return <div>Article not found</div>;
  }
  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
```

> **Note**: Server components are stateless; they can freely import services because they execute on the server. This pattern keeps data fetching inside the View layer but still respects separation by delegating to services.

---

### 4. Removing Supabase

1. Delete `src/lib/supabaseClient.ts`.
2. Uninstall Supabase SDK (`npm uninstall @supabase/supabase-js`).
3. Replace environment variables: remove `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; add `DATABASE_URL` for PostgreSQL.
4. Install Prisma (or your preferred ORM) and generate the client.
5. Create your database schema and seed it if needed.

---

### 5. Handling Markdown Posts (Current `_posts/`)

If you want to keep blog posts as markdown files (instead of moving them to PostgreSQL), you can implement a `FileSystemArticleRepository` that reads from `_posts/` and parses frontmatter. This repository implements the same `IArticleRepository` interface. Then, in your DI container, you can choose which implementation to use based on an environment variable (`USE_MARKDOWN=true`).

This way, you can have both data sources coexisting or gradually migrate posts to the database.

---

### 6. Benefits of This Approach

- **Testability**: Mock repositories allow you to unit-test services without a real database.
- **Flexibility**: You can switch from PostgreSQL to any other database (or even a REST API) by writing a new repository implementation.
- **Maintainability**: Business logic is centralized in services, not scattered across route handlers.
- **Clear separation**: Views (components) never know about the database; they only interact with services or API endpoints.

---

### 7. Additional Considerations

- **Server Actions**: If you prefer, you can use Next.js Server Actions instead of API routes for mutations (e.g., contact form submission). They can also call the same services, acting as part of the Controller layer.
- **Error Handling**: Add a consistent error handling strategy in your services (e.g., custom error classes) and return appropriate HTTP status codes in controllers.
- **Caching**: With a service layer, you can easily add caching (e.g., Redis) without affecting the rest of the application.

---

### 8. Migration Steps Summary

1. **Define domain interfaces** – entities and repository interfaces.
2. **Set up PostgreSQL** – install Prisma, define schema, and generate client.
3. **Implement repositories** – write PostgreSQL repositories that implement the interfaces.
4. **Create services** – write service classes that use repositories.
5. **Set up DI** – create a container/factory to instantiate services.
6. **Refactor API routes** – replace direct Supabase calls with service calls.
7. **Refactor server components** – use services for data fetching.
8. **Remove Supabase** – delete client code, uninstall package, update env vars.
9. **Test thoroughly**.
