# ammarPortfolio — Developer Reference

Repository: AmmarElsherif2021/ammarPortfolio · Branch: master · Verified commit: 4e579fcda0e43e11eefb62f08cd444a5a49a2d42 · Source of truth: checked-in files and package metadata.

This is the single developer reference. Part A records the verified state. Part B discusses architectural choices. Part C is the scheduled task plan, ending in a minimum-feature developer blog that is designed to be extended.

## Part A — Verified state

### A0. Phase progress

Last updated after Phases 0–2 were completed and the build-blocking fixes were landed to reach a green baseline. Part B onwards still describes the plan unchanged.

| Phase | Name                   | Status     |
| ----- | ---------------------- | ---------- |
| 0     | Baseline               | ✅ Done    |
| 1     | Prisma runtime fix     | ✅ Done    |
| 2     | Remove Supabase        | ✅ Done    |
| 3     | Remove Three.js / R3F  | ⏳ Pending |
| 4     | Babylon stabilization  | ⏳ Pending |
| 5     | Design system ("port") | ⏳ Pending |
| 6     | Developer blog         | ⏳ Pending |
| 7     | Hardening and release  | ⏳ Pending |

Baseline result on `chore/stabilize`:

- `npx tsc --noEmit` — **clean** (`baseline-tsc.log` empty).
- `npm run lint` — **clean** (`baseline-lint.log` empty).
- `npm run build` — **succeeds**: `✓ Compiled successfully`, `✓ Generating static pages (11/11)`, route table emitted, no type-error block.
- Recorded bundle: First Load JS shared by all = **104 kB**.

The build is green. Remaining work is design and cleanup, not stability.

### A1. Executive summary

The repo is a Next.js portfolio in a mixed, transitional state. It contains substantial Babylon.js work and a Prisma setup, but it is not in the fully migrated state earlier notes described. It still has the legacy Retro styling, the old Three.js stack, and Supabase client usage. Prisma is configured for Postgres with a custom generator, but the runtime code does not match that setup.

### A2. Project overview

A portfolio site built with Next.js and TypeScript, including:

- blog/article routes
- project pages and API routes
- a portfolio landing page
- a Babylon.js-driven intro scene
- Prisma-based data models and migrations
- Tailwind-based UI styling

### A3. Technology stack

Confirmed: Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma 7 (schema, migrations, seed), PostgreSQL via Prisma, Babylon.js core and loaders, and Supabase references still in code.

Dependencies of note in package.json: `@babylonjs/core`, `@babylonjs/loaders`, `@prisma/adapter-pg`, `@prisma/client`, `prisma`, `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three`, `tailwindcss`, `react`, `react-dom`, `next`.

Missing: `pg`, `@types/pg`.

The repo carries both the new Babylon direction and the legacy Three.js tooling.

### A4. Repo structure

```
ammarPortfolio/
├── prisma/
│   ├── schema.prisma
│   ├── client.ts
│   ├── config.ts / prisma.config.ts   # loads DATABASE_URL
│   └── migrations/
├── public/assets/
│   ├── fonts/
│   ├── models/                        # .glb files
│   ├── (intro assets)
│   └── scene-config.json
├── src/
│   ├── app/                           # App Router pages + API routes
│   │   ├── globals.css
│   │   └── api/health/route.ts        # imports supabaseClient
│   ├── _components/
│   │   ├── babylonScene.tsx
│   │   ├── intro.tsx
│   │   └── three/                     # legacy R3F, still present
│   ├── lib/
│   │   ├── babylon/core/              # framework-agnostic Babylon layer
│   │   ├── fonts.ts                   # local fonts
│   │   ├── supabaseClient.ts          # legacy
│   │   └── (API helpers, constants)
│   └── generated/prisma/              # custom generator output
├── tailwind.config.js
└── package.json
```

Notable files: `src/_components/babylonScene.tsx`, `src/_components/intro.tsx`, `public/assets/scene-config.json`, `prisma/schema.prisma`, `prisma/config.ts`, `src/lib/supabaseClient.ts`, `src/app/globals.css`, `tailwind.config.js`.

### A5. Babylon.js integration

Confirmed:

- `intro.tsx` uses `"use client"` and `dynamic(() => import("@/_components/babylonScene"), { ssr: false })`.
- The scene exposes imperative methods `triggerAction`, `stopAction`, `isReady`.
- `babylonScene.tsx` has an `ACTION_REGISTRY`, manual and auto actions, orbit motion via `applyOrbitMotion`, and camera actions `cameraOrbit`, `cameraLerp`, `cameraZoom`.
- Configuration is centralized in `public/assets/scene-config.json`; model loading, lights and camera are config-driven.
- A framework-agnostic `core/` layer exists under `src/lib/babylon/core/`.

Not confirmed: whether GLB emission is correct at runtime, whether the fixed camera focal-point logic is stable, and whether action triggers and camera behavior are polished or still in progress.

### A6. Prisma

Confirmed: `prisma/schema.prisma` exists; generator is `provider = "prisma-client"` with `output = "../src/generated/prisma"`; datasource is `postgresql`; a migrations folder and seed setup exist; `prisma.config.ts` loads `DATABASE_URL`.

The runtime client does not match the intended Prisma 7 setup. `prisma/client.ts` currently is:

```ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

It does not use the custom output path, the `PrismaPg` adapter, or a global singleton. The runtime fix is not in place. `pg` and `@types/pg` are also missing, so this is not a clean Prisma 7 install.

### A7. Design system

The Retro/comic system is still active; the later "port" Figma system is not applied.

- `tailwind.config.js` has retro colors: `retro-red`, `retro-orange`, `retro-gold`, `retro-teal`, `retro-violet`, `retro-ink`, `retro-cream`.
- `globals.css` has `.comic-border`, `.comic-shadow`, `.retro-btn`, `.retro-header-bar`, `.retro-avatar`, and comments referencing Black Han Sans.
- `src/lib/fonts.ts` defines local fonts; the layout imports Arvo via `next/font/google`. Poppins is not used.
- `port-*` tokens are not adopted.

### A8. Three.js / React Three Fiber

Not cleaned up. `@react-three/drei`, `@react-three/fiber`, `three` and `@types/three` are in package.json, and `src/_components/three/` exists.

### A9. Supabase

Not removed. `src/lib/supabaseClient.ts` exists, and `src/app/api/health/route.ts` imports it and queries `.from('projects').select('*').limit(1)`. Supabase is still in a production code path even though the intended backend is Prisma/Postgres.

### A10. AI scaffolding

`.agents/`, `.claude/`, `.windsurf/` and `skills-lock.json` are absent. This part of the cleanup is done.

### A11. Env and secrets

`.env` and `.env.local` do not appear in the checked-in tree. The earlier `DATABASE_URL` mismatch note cannot be verified from the repo.

### A12. Validation checklist

| Check                                   | Status |
| --------------------------------------- | ------ |
| Three.js stack still present            | Yes    |
| `src/_components/three/` still present  | Yes    |
| Supabase in code                        | Yes    |
| `supabaseClient.ts` present             | Yes    |
| `intro.tsx` exists                      | Yes    |
| Prisma schema exists                    | Yes    |
| `@prisma/client` imports remain         | Yes    |
| Prisma adapter/global singleton present | No     |
| `port-*` tokens adopted                 | No     |
| Retro design still active               | Yes    |
| Babylon architecture present            | Yes    |
| `scene-config.json` exists              | Yes    |
| GLB files in `public/assets/models`     | Yes    |
| Local font setup present                | Yes    |
| Poppins via `next/font/google`          | No     |

### A13. Verdict

Babylon integration is implemented and visible. The Prisma migration is partly present but not runtime-correct. The Retro design system, the Three.js stack and Supabase are all still active. AI tooling directories are gone.

## Part B — Architectural choices

Some of these are already in the code (marked _in place_); the rest are decisions this plan makes and the reasoning behind them. Revisit any of them before executing the matching phase.

**B1. Babylon behind a client-only boundary (in place).** The scene is imported with `dynamic(..., { ssr: false })` from a `"use client"` component. Babylon touches `window` and WebGL on import, so server rendering it would fail. `intro.tsx` is the composition root and `babylonScene.tsx` is a thin React wrapper.

**B2. Framework-agnostic `core/` (in place).** Keep React out of `src/lib/babylon/core/`. The scene logic stays testable and portable, and React only owns mount, unmount and props.

**B3. Config-driven scene (in place).** `scene-config.json` is the single source of truth for camera, lights and models. New behavior should be added as config plus a registry entry, not hardcoded values.

**B4. Action registry over switch statements (in place).** `ACTION_REGISTRY` maps action names to handlers. Adding an action means registering a handler; the dispatcher does not change. This matches the project's SOLID/factory preference.

**B5. Prisma + Postgres as the only backend (decision).** Two data layers is a liability. Prisma already owns the schema and migrations, so Supabase is removed rather than kept alongside. The health route should check the database through Prisma instead.

**B6. Prisma 7 client shape (decision).** With a custom generator output, every import comes from `src/generated/prisma`. Prisma 7 has no Rust engine, so it needs the `PrismaPg` adapter from `@prisma/adapter-pg`, which in turn needs `pg`. In development, a `globalThis` singleton prevents connection-pool exhaustion on hot reload. One module (`prisma/client.ts`) exports the client; nothing else instantiates one.

**B7. Remove Three.js/R3F entirely (decision).** Two 3D engines double the bundle and the mental load. Babylon is the chosen engine, so the R3F packages and `src/_components/three/` go. Confirm nothing imports them before deleting.

**B8. Design system: finish the "port" migration, but treat it as a decision point.** The repo is still fully Retro. The earlier direction was a clean Figma-based "port" system (Poppins, white/black/navy, three gradients). Plan assumes that direction continues. If Retro is now preferred, skip Phase 5 and instead rename tokens consistently; the rest of the plan is unaffected.

**B9. Fonts through `next/font` (decision).** Poppins loaded via `next/font/google` avoids layout shift and LCP delays on a font-heavy hero. The local font definitions and Arvo import get consolidated into one font module.

**B10. Blog content in Postgres via Prisma, markdown rendered at request/build time (decision).** Alternatives considered: MDX files in the repo (simpler, git-versioned, but no editing UI and the blog would not exercise the existing Prisma setup) versus a headless CMS (extra service). The DB-backed approach reuses the existing schema/migrations, allows draft/publish, and can be extended to comments or search later. Rendering uses ISR with on-demand revalidation so posts are static-fast but update when published.

## Part C — Scheduled tasks

Each phase leaves the repo building and deployable. Do them in order; the dependencies are noted.

Commands are Windows PowerShell, run from the repo root. A search that prints nothing means that check passes. Paths marked "confirm" or "suggested" were not visible in the verified report: check them in the repo first.

### Phase 0 — Baseline (before touching code)

1. Create a branch `chore/stabilize` from master.
2. Run install, type-check, lint and build; record the current failures as the baseline.
3. Add `.env.example` documenting `DATABASE_URL` and any other required variables; confirm `.env` and `.env.local` are gitignored. Decide on one local env file (recommended: `.env`, because the Prisma CLI reads it by default) and remove the ambiguity.
4. Grep for usages before each deletion in later phases: `grep -r "supabase\|@react-three\|three\|@prisma/client" src prisma`.

**Modules involved**

| Action | Module         | Change                                                                                             |
| ------ | -------------- | -------------------------------------------------------------------------------------------------- |
| Create | `.env.example` | Document `DATABASE_URL` and any other required variables                                           |
| Edit   | `.gitignore`   | Ignore `.env`, `.env.local` and `baseline-*.log`; decide whether `src/generated/prisma` is ignored |
| Edit   | `package.json` | Add a `typecheck` script (`tsc --noEmit`) if missing                                               |

**Done when:** a clean baseline build result is recorded and env handling is documented.

```powershell
git switch -c chore/stabilize
npm ci
npx tsc --noEmit 2>&1 | Tee-Object baseline-tsc.log
npm run lint 2>&1 | Tee-Object baseline-lint.log
npm run build 2>&1 | Tee-Object baseline-build.log
Test-Path .env.example                 # expect True
git check-ignore -v .env .env.local    # expect a matching .gitignore rule for each
```

### Phase 1 — Prisma runtime fix

1. Install `pg` and `@types/pg`.
2. Rewrite `prisma/client.ts`: import `PrismaClient` from `src/generated/prisma` (the generated client entry), construct it with a `PrismaPg` adapter built from `DATABASE_URL`, and cache it on `globalThis` outside production.
3. Replace every `@prisma/client` import in `src` and `prisma` (seed included) with the generated path. Keep `@prisma/client` in package.json only if the generator still requires it.
4. Run `prisma generate`, then `prisma migrate dev` against a local database, then the seed.
5. Confirm `src/generated/prisma` is gitignored or intentionally committed, and document which.

**Modules involved**

| Action | Module                                                           | Change                                                                                            |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Edit   | `prisma/client.ts`                                               | Import the generated client, add the `PrismaPg` adapter, cache on `globalThis` outside production |
| Edit   | `package.json`                                                   | Add `pg` and `@types/pg`                                                                          |
| Edit   | Seed script (`prisma/seed.ts`, confirm)                          | Use the generated import or the shared client                                                     |
| Edit   | `prisma.config.ts` (or `prisma/config.ts`, whichever is live)    | Confirm `DATABASE_URL` loads                                                                      |
| Edit   | Every file outside `src/generated` that imports `@prisma/client` | Point to `src/generated/prisma`                                                                   |
| Create | `src/generated/prisma`                                           | Not by hand: `prisma generate` produces it                                                        |

**Done when:** a script or route can read from the database through the shared client, and no hand-written file imports `@prisma/client`. Generated code legitimately imports `@prisma/client/runtime`, so the search skips it.

```powershell
npm install pg
npm install -D @types/pg
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma migrate status              # expect: Database schema is up to date
Get-ChildItem src,prisma -Recurse -Include *.ts,*.tsx |
  Where-Object { $_.FullName -notmatch '\\generated\\' } |
  Select-String -Pattern '@prisma/client'    # expect no output
Select-String -Path prisma\client.ts -Pattern 'PrismaPg','globalThis'    # expect a hit for each
npx tsc --noEmit
```

### Phase 2 — Remove Supabase

1. Rewrite `src/app/api/health/route.ts` to run a trivial Prisma query (for example `$queryRaw` select 1, or counting projects) and return status JSON.
2. Delete `src/lib/supabaseClient.ts`.
3. Remove `@supabase/*` packages and any Supabase env variables from `.env.example`.
4. Search for any remaining `projects` table reads that assumed Supabase shape and port them to Prisma models.

**Modules involved**

| Action | Module                                                              | Change                                         |
| ------ | ------------------------------------------------------------------- | ---------------------------------------------- |
| Edit   | `src/app/api/health/route.ts`                                       | Replace the Supabase query with a Prisma query |
| Edit   | `package.json`                                                      | Remove `@supabase/*` packages                  |
| Edit   | `.env.example`                                                      | Remove Supabase variables                      |
| Edit   | Any file the search below finds reading `projects` through Supabase | Port to Prisma models                          |
| Delete | `src/lib/supabaseClient.ts`                                         | Legacy client                                  |

**Done when:** no Supabase reference remains outside the lockfile history and the health route passes against Postgres.

```powershell
Remove-Item src\lib\supabaseClient.ts
npm uninstall @supabase/supabase-js    # also uninstall any other @supabase/* package in package.json
Get-ChildItem src,prisma -Recurse -Include *.ts,*.tsx | Select-String -Pattern 'supabase'    # expect no output
Select-String -Path package.json,.env.example -Pattern 'supabase'                            # expect no output
npm run build
# with `npm run dev` running in a second terminal:
Invoke-RestMethod http://localhost:3000/api/health    # expect the ok payload from Postgres
```

### Phase 3 — Remove Three.js / R3F

1. Grep for imports from `three` and `@react-three/*`, and for `src/_components/three/`.
2. If any component still uses them, port it to Babylon or delete it; flag ambiguous items rather than removing silently.
3. Delete `src/_components/three/` and uninstall `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
4. Rebuild and compare bundle size against the Phase 0 baseline.

**Modules involved**

| Action | Module                                                                     | Change                                                                    |
| ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Delete | `src/_components/three/`                                                   | Legacy R3F components                                                     |
| Edit   | Any component the search below finds importing `three` or `@react-three/*` | Port to Babylon, or remove the usage                                      |
| Edit   | `package.json`                                                             | Remove `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` |
| Edit   | `next.config.*` (confirm)                                                  | Remove `transpilePackages` entries for three, if present                  |

**Done when:** no import references Three.js and the build passes with a smaller bundle.

```powershell
# run the search BEFORE deleting and review every hit
Get-ChildItem src -Recurse -Include *.ts,*.tsx | Select-String -Pattern 'from\s+[''"]three|@react-three'
Remove-Item src\_components\three -Recurse -Force
npm uninstall three @react-three/fiber @react-three/drei @types/three
Test-Path src\_components\three        # expect False
Select-String -Path package.json -Pattern '"three"|@react-three|@types/three'    # expect no output
npm run build
# bundle size, compare with the same command run in Phase 0:
(Get-ChildItem .next\static\chunks -Recurse -File | Measure-Object Length -Sum).Sum / 1KB
```

### Phase 4 — Babylon stabilization

The unconfirmed items from A5 are the work.

1. **GLB emission:** after loading each model, walk its materials and apply emissive color/intensity from config. Verify in the Babylon Sandbox first, then in the scene; keep the values in `scene-config.json`.
2. **Camera focal point:** simplify `cameraLerp` to interpolate position toward a fixed target at the origin (target defined in config). Remove special cases that fight the lerp.
3. **Action behavior:** exercise every action in `ACTION_REGISTRY` through `triggerAction`/`stopAction`, including `isReady` gating and orbit motion for models with `isStill: false`. Fix races where an action starts before the scene is ready.
4. **Lifecycle:** confirm the `useEffect` cleanup disposes the engine, scene, observers and listeners on unmount, including during Next route changes and React strict-mode double mounting.
5. **Performance guards:** pause rendering when the tab is hidden or the canvas is off-screen, respect `prefers-reduced-motion`, and provide a static fallback if WebGL is unavailable.
6. **Loading UX:** show a lightweight placeholder until `isReady()` is true.

**Modules involved**

| Action | Module                                                                         | Change                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Edit   | `src/_components/babylonScene.tsx`                                             | Emission pass after model load, simpler `cameraLerp`, ready-gated actions, pause when hidden or reduced motion, full dispose on unmount |
| Edit   | `src/lib/babylon/core/` (camera and model-loading modules; confirm file names) | Hold lerp and emission logic here, no React imports                                                                                     |
| Edit   | `public/assets/scene-config.json`                                              | Emissive color and intensity per model, camera target, reduced-motion flags                                                             |
| Edit   | `src/_components/intro.tsx`                                                    | Loading placeholder until `isReady()`, static fallback without WebGL                                                                    |
| Create | `src/lib/babylon/core/emission.ts` (suggested)                                 | Emission helper that reads the config                                                                                                   |
| Create | A static fallback image under `public/assets/intro/` (suggested)               | Shown without WebGL or with reduced motion                                                                                              |
| Delete | Dead special-case branches in the camera lerp code                             | Remove, do not comment out                                                                                                              |

**Done when:** the intro scene loads, animates and unmounts cleanly with no console errors, and all registry actions behave as configured. The commands cover the static checks; the runtime check is manual.

```powershell
Get-Content public\assets\scene-config.json -Raw | ConvertFrom-Json | Out-Null; $?    # expect True (valid JSON)
Get-ChildItem public\assets\models -Filter *.glb | Select-Object Name, Length          # every model named in the config exists
Get-ChildItem src\lib\babylon\core -Recurse -Include *.ts,*.tsx | Select-String -Pattern 'from\s+[''"]react'    # expect no output
Select-String -Path src\_components\babylonScene.tsx -Pattern 'dispose'                # cleanup present
npm run build
npm run dev    # then, in the browser: no console errors, route changes unmount cleanly, every registry action fires
```

### Phase 5 — Design system ("port")

1. Define tokens in `tailwind.config.js`: `port-*` colors (white, black, navy), and three gradient utilities named colorful, powerful and beautiful. Keep Figma as the source of truth and note the token mapping in this doc.
2. Consolidate fonts into one module using `next/font/google` for Poppins; remove the local font definitions and the Arvo import if no longer used.
3. Rewrite `globals.css`: remove `.comic-border`, `.comic-shadow`, `.retro-btn`, `.retro-header-bar`, `.retro-avatar` and the Black Han Sans comments; keep only base layers and shared utilities.
4. Migrate components page by page (Header, Footer, Alert, Avatar, DateFormatter, HeroPost, article and project cards, cover image, intro) replacing `retro-*` classes with `port-*` tokens.
5. Resolve two flagged inconsistencies: the footer lists four nav items while only three gradient tokens exist (decide whether to add a token or reduce items), and branding uses "Portfolio" in header/footer but an author name elsewhere (pick one and apply everywhere).
6. Remove the `retro-*` colors from the Tailwind config once nothing references them.

**Modules involved**

| Action | Module                                                                                                                          | Change                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Edit   | `tailwind.config.js`                                                                                                            | Add `port-*` colors and the three gradient utilities; remove `retro-*` colors last                            |
| Edit   | `src/app/globals.css`                                                                                                           | Remove `.comic-border`, `.comic-shadow`, `.retro-btn`, `.retro-header-bar`, `.retro-avatar`; keep base layers |
| Edit   | `src/lib/fonts.ts`                                                                                                              | One font module, Poppins via `next/font/google`                                                               |
| Edit   | `src/app/layout.tsx` (confirm)                                                                                                  | Replace the Arvo import with Poppins                                                                          |
| Edit   | `src/_components/`: Header, Footer, Alert, Avatar, DateFormatter, HeroPost, article and project cards, cover image, `intro.tsx` | Replace `retro-*` classes with `port-*` tokens                                                                |
| Edit   | Page files under `src/app`                                                                                                      | Same class migration                                                                                          |
| Delete | Unused font files in `public/assets/fonts`                                                                                      | Only after a search shows no reference                                                                        |

**Done when:** no `retro-` or `comic-` reference remains and pages render consistently with the new tokens.

```powershell
Get-ChildItem src,tailwind.config.js -Recurse -Include *.ts,*.tsx,*.css,*.js | Select-String -Pattern 'retro-|comic-|Black Han Sans|Arvo'    # expect no output
Select-String -Path src\app\layout.tsx,src\lib\fonts.ts -Pattern 'Poppins'    # expect a hit
Select-String -Path tailwind.config.js -Pattern 'port'                          # expect the new tokens
npm run build
```

### Phase 6 — Developer blog (minimum features)

The repo already has blog/article routes. First confirm what data source they use today (static files, Supabase, or Prisma) and adapt rather than duplicate.

**Data model (Prisma).**

- `Post`: id, slug (unique), title, excerpt, content (markdown), coverImage (optional), status (`DRAFT` | `PUBLISHED`), publishedAt, createdAt, updatedAt.
- `Tag`: id, name, slug (unique), with a many-to-many relation to `Post`.
- Add indexes on `slug` and on `(status, publishedAt)`.
- Create a migration and seed two or three sample posts.

**Minimum feature set.**

1. **Post list page** at `/blog`: published posts ordered by `publishedAt` descending, showing title, excerpt, date and tags, rendered with the rebuilt `article-card`.
2. **Post detail page** at `/blog/[slug]`: markdown rendered with syntax-highlighted code blocks, reading time, tags, and a 404 for missing or draft posts.
3. **Tag filtering** at `/blog/tag/[slug]`.
4. **Static generation with revalidation:** `generateStaticParams` for published posts plus ISR; a protected revalidate endpoint (or tag-based `revalidateTag`) to refresh after publishing.
5. **SEO:** per-post `generateMetadata` (title, description, Open Graph image), `sitemap.ts`, and an RSS feed route.
6. **Authoring (minimal):** one protected path to create and edit posts. Simplest option: a seed/CLI script that imports markdown files into the database; next step is a token-protected route handler for create and update. A full admin UI is out of scope for the minimum.
7. **Accessibility and design:** semantic headings, readable line length, and the `port-*` tokens and Poppins typography.
8. **Tests:** unit-test the slug and reading-time helpers, and one integration test that the list and detail pages render seeded data.

**Modules involved.** The repo already has blog/article routes: where a path below exists, edit it instead of creating a duplicate.

| Action | Module                                                              | Change                                                                            |
| ------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Edit   | `prisma/schema.prisma`                                              | `Post`, `Tag`, a `PostStatus` enum, indexes on `slug` and `(status, publishedAt)` |
| Create | `prisma/migrations/<timestamp>_add_blog_models/`                    | Generated by `prisma migrate dev`                                                 |
| Edit   | Seed script (`prisma/seed.ts`, confirm)                             | Two or three sample posts and tags                                                |
| Create | `src/lib/blog.ts`                                                   | Prisma queries: published list, by slug, by tag                                   |
| Create | `src/lib/markdown.ts`                                               | Markdown rendering, code highlighting, reading time                               |
| Create | `src/app/blog/page.tsx`                                             | Post list                                                                         |
| Create | `src/app/blog/[slug]/page.tsx`                                      | Detail page with `generateStaticParams` and `generateMetadata`                    |
| Create | `src/app/blog/tag/[slug]/page.tsx`                                  | Tag filter                                                                        |
| Create | `src/app/sitemap.ts`                                                | Posts in the sitemap                                                              |
| Create | `src/app/rss.xml/route.ts`                                          | RSS feed                                                                          |
| Create | `src/app/api/revalidate/route.ts`                                   | Token-protected revalidation                                                      |
| Create | `scripts/import-posts.ts`                                           | Markdown-to-database import, the minimal authoring path                           |
| Create | `src/lib/blog.test.ts`                                              | Slug and reading-time tests                                                       |
| Edit   | Existing blog routes and `src/_components/article-card.tsx`         | Adapt to the Prisma data source                                                   |
| Edit   | `package.json`                                                      | Markdown and highlighting packages, a test runner, a TypeScript script runner     |
| Delete | Any old static or Supabase-backed post loader (confirm what exists) | After the new routes work                                                         |

**Done when:** a post written in markdown can be added to the database, appears on `/blog`, opens at its own URL with correct metadata, appears in the sitemap and RSS feed, and drafts stay hidden.

```powershell
npx prisma migrate dev --name add_blog_models
npx prisma db seed
npm test
npm run build
Test-Path -LiteralPath 'src\app\blog\page.tsx','src\app\blog\[slug]\page.tsx','src\app\blog\tag\[slug]\page.tsx','src\app\sitemap.ts','src\app\rss.xml\route.ts'    # expect True for each
# with `npm run dev` running in a second terminal:
(Invoke-WebRequest http://localhost:3000/blog -UseBasicParsing).StatusCode                     # expect 200
(Invoke-WebRequest http://localhost:3000/rss.xml -UseBasicParsing).Headers['Content-Type']    # expect an XML type
(Invoke-WebRequest http://localhost:3000/sitemap.xml -UseBasicParsing).Content | Select-String -Pattern '/blog/'
try { Invoke-WebRequest http://localhost:3000/blog/<draft-slug> -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }    # expect 404
```

### Phase 7 — Hardening and release

1. CI: install, type-check, lint, build and tests on every push.
2. Run Lighthouse on the landing page and a post page; target good LCP, noting the 3D scene's effect and deferring it if it hurts.
3. Confirm production env variables, the migration deploy step, and the database connection limit.
4. Update this document so Part A reflects the new verified state, and tag a release.

**Modules involved**

| Action | Module                           | Change                                                   |
| ------ | -------------------------------- | -------------------------------------------------------- |
| Create | `.github/workflows/ci.yml`       | Install, type-check, lint, test and build on every push  |
| Edit   | `package.json`                   | `typecheck`, `lint` and `test` scripts if missing        |
| Edit   | `next.config.*` (confirm)        | Only if Lighthouse or security-header work needs it      |
| Edit   | This document                    | Part A updated to the new verified state and commit hash |
| Delete | Untracked `baseline-*.log` files | Local cleanup                                            |

**Done when:** CI runs green, the Lighthouse result is recorded, and the release is tagged.

```powershell
npm ci
npx tsc --noEmit
npm run lint
npm test
npm run build
Test-Path .github\workflows\ci.yml                  # expect True
Remove-Item baseline-*.log -ErrorAction SilentlyContinue
git status --short                                   # expect no output (clean tree)
# against the production build (`npm run start`):
npx lighthouse http://localhost:3000 --only-categories=performance --output=json --output-path=lighthouse-home.json --chrome-flags="--headless"
# from the deploy environment, with the production DATABASE_URL:
npx prisma migrate deploy
git tag v0.1.0
```

## Part D — Extension backlog (open-ended)

Ideas the minimum blog is designed to accommodate, in rough order of value:

- Full-text search (Postgres full-text first)
- Series/collections and related-post suggestions
- Draft preview links
- Comments or reactions
- View counts and basic analytics
- Newsletter signup
- Admin UI with a markdown editor and image upload
- MDX support for interactive embeds, including small Babylon demos inside posts
- Bilingual content
- Scheduled publishing

## Maintenance rule

Whenever a phase completes, update Part A with the new verified state and the commit hash it was checked against, so this document stays the most accurate record of the codebase.
