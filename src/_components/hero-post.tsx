import Avatar from "@/_components/avatar";
import CoverImage from "@/_components/cover-image";
import { type User } from "@/domain/entities/User";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  created_at: string;
  author: User;
  slug: string;
};

const defaultAuthor: User = {
  id: "1",
  email: "ammar.alshareef2014@gmail.com",
  name: "Ammar Elsherif",
  role: "admin",
  created_at: new Date().toISOString(),
};

export function HeroPost({
  title,
  coverImage,
  created_at,
  author = defaultAuthor,
  slug,
}: Props) {
  return (
    <section className="mb-20 md:mb-28 animate-slide-in">
      {/* Cover image */}
      <div className="mb-6 shadow-card">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>

      {/* Info panel — two-column card */}
      <div className="grid md:grid-cols-2 rounded-card overflow-hidden shadow-card bg-port-white">
        {/* Left — title block, colorful gradient accent */}
        <div className="bg-grad-colorful p-8 md:p-10 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-btn bg-port-white/20 backdrop-blur-sm">
              <span className="font-uniSans font-semibold text-2xs uppercase tracking-wide text-port-white">
                New post
              </span>
            </span>
            <span className="font-uniSans text-2xs uppercase tracking-wide text-port-white/80">
              <DateFormatter dateString={created_at} />
            </span>
          </div>

          <h3 className="font-uniSans font-semibold text-3xl lg:text-4xl leading-tight text-port-white">
            <Link
              href={`/posts/${slug}`}
              className="no-underline hover:opacity-80 transition-opacity duration-150"
            >
              {title}
            </Link>
          </h3>
        </div>

        {/* Right — author block */}
        <div className="p-8 md:p-10 flex flex-col justify-between gap-6 bg-port-white">
          <span className="font-uniSans font-semibold text-2xs uppercase tracking-wide text-port-muted">
            Author
          </span>

          <Avatar name={author.name} picture={author.avatar_url ?? null} />

          <Link
            href={`/posts/${slug}`}
            className="port-btn w-fit hover:-translate-y-0.5 transition-transform duration-150 no-underline"
          >
            Read post →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroPost;
