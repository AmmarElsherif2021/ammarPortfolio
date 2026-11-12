'use client';

import Alert from '@/_components/alert';
import Avatar from '@/_components/avatar';
import CoverImage from '@/_components/cover-image';
import DateFormatter from '@/_components/date-formatter';
import Header from '@/_components/header';
import { HeroPost } from '@/_components/hero-post';
import { Intro } from '@/_components/intro';
import { MoreStories } from '@/_components/more-stories';
import { ArticleBody } from '@/_components/article-body';
import { ArticleHeader } from '@/_components/article-header';
//import { ArticlePreview } from '@/_components/article-preview';
import { ArticleTitle } from '@/_components/article-title';
import { SectionSeparator } from '@/_components/section-separator';
import { type User } from '@/domain/entities/User';

// ── accent config ──────────────────────────────────────────────────────────────
type Accent = 'yellow' | 'mint' | 'pink' | 'orange' | 'purple' | 'cyan';

const A: Record<
  Accent,
  { bar: string; badge: string; shadow: string; dot: string; title: string }
> = {
  yellow: {
    bar: 'bg-retro-yellow',
    badge: 'bg-retro-navy text-retro-yellow',
    shadow: 'shadow-comic',
    dot: 'bg-retro-yellow',
    title: 'text-retro-navy',
  },
  mint: {
    bar: 'bg-retro-mint',
    badge: 'bg-retro-navy text-retro-mint',
    shadow: 'shadow-comic-mint',
    dot: 'bg-retro-mint',
    title: 'text-retro-navy',
  },
  pink: {
    bar: 'bg-retro-pink',
    badge: 'bg-retro-navy text-retro-pink',
    shadow: 'shadow-comic-pink',
    dot: 'bg-retro-pink',
    title: 'text-retro-navy',
  },
  orange: {
    bar: 'bg-retro-orange',
    badge: 'bg-retro-navy text-retro-orange',
    shadow: 'shadow-comic-orange',
    dot: 'bg-retro-orange',
    title: 'text-retro-navy',
  },
  purple: {
    bar: 'bg-retro-teal',
    badge: 'bg-retro-cream text-retro-teal',
    shadow: 'shadow-comic-purple',
    dot: 'bg-retro-teal',
    title: 'text-retro-cream',
  },
  cyan: {
    bar: 'bg-retro-cyan',
    badge: 'bg-retro-navy text-retro-cyan',
    shadow: 'shadow-comic-cyan',
    dot: 'bg-retro-cyan',
    title: 'text-retro-navy',
  },
};

// ── retro OS window (internet day browser chrome) ─────────────────────────────
function WindowFrame({
  title,
  accent,
  children,
}: {
  title: string;
  accent: Accent;
  children: React.ReactNode;
}) {
  const a = A[accent];
  return (
    <div
      className={`border-3 border-retro-navy bg-retro-cream dark:bg-slate-900 ${a.shadow} mb-10 animate-slide-in`}
    >
      {/* Title bar (internet day pink title bar style) */}
      <div className={`flex items-center gap-2 px-3 py-1.5 border-b-3 border-retro-navy ${a.bar}`}>
        {/* Traffic lights (internet day browser dots) */}
        <span className="w-3 h-3 rounded-full bg-retro-coral border-2 border-retro-navy" />
        <span className="w-3 h-3 rounded-full bg-retro-lemon border-2 border-retro-navy" />
        <span className={`w-3 h-3 rounded-full ${a.dot} border-2 border-retro-navy`} />

        {/* Window title badge (poster CTA badge style) */}
        <span
          className={`ml-2 font-mono text-xs font-black tracking-widest2 uppercase px-2 py-0.5
                          ${a.badge} border-2 border-retro-navy`}
        >
          &lt;{title} /&gt;
        </span>

        {/* Right: PREVIEW stamp */}
        <span
          className={`ml-auto font-mono text-2xs font-bold tracking-widest uppercase ${a.title} opacity-50`}
        >
          PREVIEW
        </span>
      </div>

      {/* Body */}
      <div className="p-5">{children}</div>
    </div>
  );
}

function VTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-block w-1.5 h-1.5 bg-retro-navy dark:bg-slate-400" />
      <p className="font-mono text-2xs font-bold tracking-widest uppercase text-retro-navy/40 dark:text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Rule({ accent }: { accent: Accent }) {
  return (
    <div className="my-5 flex items-center gap-0">
      <div className={`h-2 flex-1 ${A[accent].dot} border-y-2 border-retro-navy`} />
      {/* Checker block end-cap (mosaic landing page) */}
      <div
        className="w-8 h-2 border-y-2 border-retro-navy"
        style={{
          backgroundImage: 'repeating-conic-gradient(#0D0D2B 0% 25%, transparent 0% 50%)',
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  );
}

// ── mock data ──────────────────────────────────────────────────────────────────
const mockAuthor: User = {
  id: '1',
  email: 'ammar.alshareef2014@gmail.com',
  name: 'Ammar Elsherif',
  role: 'admin',
  created_at: new Date().toISOString(),
  avatar_url: 'https://avatars.githubusercontent.com/u/10309100?v=4',
};

const mockArticles = [
  {
    id: '1',
    slug: 'sample-post-1',
    title: 'Sample Post 1',
    coverImage: '/assets/blog/authors/jj.jpeg',
    createdAt: new Date().toISOString(),
    author: mockAuthor,
    excerpt: 'This is a sample excerpt for the post preview.',
  },
  {
    id: '2',
    slug: 'sample-post-2',
    title: 'Sample Post 2',
    coverImage: '/assets/blog/authors/jj.jpeg',
    createdAt: new Date().toISOString(),
    author: mockAuthor,
    excerpt: 'Another sample excerpt to test the grid layout.',
  },
];

// ── component ──────────────────────────────────────────────────────────────────
export function PreviewTest() {
  return (
    <div
      className="py-10 px-2"
      style={{
        // Yellow retro grid (poster background)
        backgroundImage:
          'linear-gradient(rgba(13,13,43,0.09) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(13,13,43,0.09) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        backgroundColor: '#FFFBF0',
      }}
    >
      {/* ── Header banner (landing page purple mosaic bar) ── */}
      <div
        className="mb-10 border-3 border-retro-navy shadow-comic-xl overflow-hidden
                   flex flex-col sm:flex-row"
      >
        <Header />
        {/* Left purple block */}
        <div className="bg-retro-teal p-5 flex flex-col justify-center sm:w-2/3">
          <p className="font-mono text-2xs font-bold tracking-widest2 uppercase text-retro-cyan mb-1 animate-blink">
            ● LIVE TEST
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase text-retro-cream tracking-tight leading-none">
            Component Test Lab
          </h2>
          <p className="font-body text-xs text-retro-lavender mt-2">
            All components rendered with the retro-pop theme
          </p>
        </div>

        {/* Right colour swatch strip (mosaic landing page block colours) */}
        <div className="flex sm:w-1/3 border-t-3 sm:border-t-0 sm:border-l-3 border-retro-navy">
          {(['yellow', 'pink', 'mint', 'orange', 'cyan', 'purple'] as Accent[]).map((c) => (
            <div
              key={c}
              className={`flex-1 ${A[c].dot} border-r-2 last:border-r-0 border-retro-navy`}
            />
          ))}
        </div>
      </div>

      {/* ── Existing components ── */}
      <WindowFrame title="Alert" accent="orange">
        <VTag label="preview={false} — default bar" />
        <Alert preview={false} />
        <Rule accent="orange" />
        <VTag label="preview={true} — edit mode bar" />
        <Alert preview={true} />
      </WindowFrame>

      <WindowFrame title="Avatar" accent="mint">
        <div className="flex flex-wrap gap-8">
          <div>
            <VTag label="with picture prop" />
            <Avatar name="Ammar Elsherif" picture="https://i.pravatar.cc/150?img=12" />
          </div>
          <div>
            <VTag label="picture={null} — initial fallback" />
            <Avatar name="Ammar Elsherif" picture={null} />
          </div>
        </div>
      </WindowFrame>

      <WindowFrame title="DateFormatter" accent="yellow">
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'ISO 8601', val: '2024-05-20T10:30:00.000Z' },
            { label: 'Supabase space-separated', val: '2024-11-03 08:15:00' },
            { label: 'null — empty fallback', val: null },
          ].map(({ label, val }) => (
            <div
              key={label}
              className="border-3 border-retro-navy bg-retro-cream dark:bg-slate-800
                         px-4 py-3 shadow-comic"
            >
              <VTag label={label} />
              <span className="font-display text-xl font-black text-retro-navy dark:text-retro-cream">
                <DateFormatter dateString={val} />
              </span>
            </div>
          ))}
        </div>
      </WindowFrame>

      <WindowFrame title="CoverImage" accent="cyan">
        <VTag label="slug provided — hover shadow active" />
        <div className="border-3 border-retro-navy mb-5 shadow-comic overflow-hidden">
          <CoverImage title="A Sample Post" src="/assets/blog/authors/jj.jpeg" slug="sample-post" />
        </div>
        <Rule accent="cyan" />
        <VTag label="no slug — plain image, no anchor" />
        <div className="border-3 border-retro-navy shadow-comic overflow-hidden">
          <CoverImage title="A Sample Post" src="/assets/blog/authors/jj.jpeg" />
        </div>
      </WindowFrame>

      <WindowFrame title="HeroPost" accent="pink">
        <HeroPost
          title="Welcome to the Blog – Full Hero Post Render"
          coverImage="/assets/blog/authors/jj.jpeg"
          created_at={new Date().toISOString()}
          author={mockAuthor}
          slug="welcome-to-the-blog"
        />
      </WindowFrame>

      {/* ── Newly updated components ── */}
      <WindowFrame title="Intro" accent="purple">
        <Intro />
      </WindowFrame>

      <WindowFrame title="ArticleTitle" accent="yellow">
        <ArticleTitle>Sample Post Title</ArticleTitle>
      </WindowFrame>

      <WindowFrame title="ArticleHeader" accent="orange">
        <ArticleHeader
          title="Sample Post Title"
          coverImage="/assets/blog/authors/jj.jpeg"
          date={new Date().toISOString()}
          author={mockAuthor}
        />
      </WindowFrame>

      <WindowFrame title="ArticleBody" accent="mint">
        <ArticleBody content="<p>This is a sample post body content written in HTML. It demonstrates how the retro styles are applied to the markdown content.</p><p>Links like <a href='#'>this one</a> will get the retro orange color.</p>" />
      </WindowFrame>

      <WindowFrame title="MoreStories" accent="cyan">
        <MoreStories articles={mockArticles} />
      </WindowFrame>

      <WindowFrame title="SectionSeparator" accent="pink">
        <SectionSeparator />
      </WindowFrame>

      {/* ── Footer stamp (poster bottom bar style) ── */}
      <div className="flex items-center justify-center mt-4 gap-3">
        <div
          className="border-3 border-retro-navy bg-retro-yellow px-5 py-2 shadow-comic-lg
                     flex items-center gap-3"
        >
          {/* Checker end-cap */}
          <div
            className="w-6 h-6 border-2 border-retro-navy shrink-0"
            style={{
              backgroundImage: 'repeating-conic-gradient(#0D0D2B 0% 25%, #FFE600 0% 50%)',
              backgroundSize: '6px 6px',
            }}
          />
          <p className="font-display text-sm font-black uppercase tracking-widest2 text-retro-navy">
            ✓ All components rendered
          </p>
          {/* Smiley (poster style) */}
          <span className="text-retro-navy text-lg leading-none" aria-hidden>
            ☻
          </span>
        </div>
      </div>
    </div>
  );
}
