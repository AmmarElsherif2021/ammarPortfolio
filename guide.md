```
-- Users Table (Supabase Auth handles most, this is optional custom data)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Articles (Blog Posts)
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments on Articles
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  article_id INT REFERENCES articles(id) ON DELETE CASCADE,
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects (Portfolio)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tech_stack TEXT[], -- e.g., ["React", "Next.js", "TypeScript"]
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Learning Resources
CREATE TABLE learning_resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL, -- e.g., "DSA", "System Design", "Next.js"
  url TEXT,
  category TEXT, -- e.g., "Tutorial", "Article", "Video"
  difficulty TEXT, -- "Beginner", "Intermediate", "Advanced"
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Form Submissions
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  subject TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

```
└── 📁ammarPortfolio
    └── 📁_posts
        ├── dynamic-routing.md
        ├── hello-world.md
        ├── preview.md
    └── 📁public
        └── 📁assets
            └── 📁blog
                └── 📁authors
                    ├── jj.jpeg
                    ├── joe.jpeg
                    ├── tim.jpeg
                └── 📁dynamic-routing
                    ├── cover.jpg
                └── 📁hello-world
                    ├── cover.jpg
                └── 📁preview
                    ├── cover.jpg
        └── 📁favicon
            ├── android-chrome-192x192.png
            ├── android-chrome-512x512.png
            ├── apple-touch-icon.png
            ├── browserconfig.xml
            ├── favicon-16x16.png
            ├── favicon-32x32.png
            ├── favicon.ico
            ├── mstile-150x150.png
            ├── safari-pinned-tab.svg
            ├── site.webmanifest
    └── 📁src
        └── 📁api
            └── 📁articles
                └── 📁[id]
                    ├── route.ts
                ├── route.ts
            └── 📁contact
                ├── route.ts
            └── 📁health
                ├── route.ts
            └── 📁projects
                ├── route.ts
            └── 📁resources
            └── 📁users
        └── 📁app
            └── 📁_components
                ├── alert.tsx
                ├── avatar.tsx
                ├── container.tsx
                ├── cover-image.tsx
                ├── date-formatter.tsx
                ├── footer.tsx
                ├── header.tsx
                ├── hero-post.tsx
                ├── intro.tsx
                ├── markdown-styles.module.css
                ├── more-stories.tsx
                ├── post-body.tsx
                ├── post-header.tsx
                ├── post-preview.tsx
                ├── post-title.tsx
                ├── section-separator.tsx
                ├── switch.module.css
                ├── theme-switcher.tsx
            └── 📁404
                ├── page.tsx
            └── 📁about
                ├── page.tsx
            └── 📁contact
                ├── page.tsx
            └── 📁dashboard
                ├── page.tsx
            └── 📁posts
                └── 📁[slug]
                    ├── page.tsx
            └── 📁projects
                └── 📁[id]
                    ├── page.tsx
                ├── page.tsx
            ├── globals.css
            ├── layout.tsx
            ├── page.tsx
        └── 📁interfaces
            ├── author.ts
            ├── post.ts
            ├── projects.ts
        └── 📁lib
            ├── api.ts
            ├── constants.ts
            ├── markdownToHtml.ts
            ├── supabaseClient.ts
    ├── .env.local
    ├── .gitignore
    ├── └── 📁src.md
    ├── helper.md
    ├── next-env.d.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.ts
    └── tsconfig.json
```