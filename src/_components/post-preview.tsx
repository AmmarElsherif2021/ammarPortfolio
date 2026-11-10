import { type User } from "@/domain/entities/User";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: User;
  slug: string;
};

export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div className="group h-auto  bg-port-white border border-port-dark/20 hover:border-port-dark/50 transition-colors duration-200 overflow-hidden shadow-card">
      {/* Cover image */}
      <div className="border-b border-port-dark/20">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col gap-3">
        {/* Date pill */}
        <div className="port-body2 text-port-dark/60">
          <DateFormatter dateString={date} />
        </div>

        {/* Title */}
        <h3 className="font-uniSans font-semibold text-xl leading-7 text-port-black">
          <Link
            href={`/posts/${slug}`}
            className="no-underline hover:opacity-70 transition-opacity duration-150 text-port-black"
          >
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="port-body2 leading-6 line-clamp-6">{excerpt}</p>

        {/* Footer row — avatar + "More →" */}
        <div className="flex items-center justify-between pt-3 border-t border-port-dark/10 mt-1">
          <Avatar name={author.name} picture={null} />

          <Link
            href={`/posts/${slug}`}
            className="flex items-center gap-2 no-underline group/more"
          >
            <span className="port-more group-hover/more:opacity-60 transition-opacity">
              More
            </span>
            <span
              className="inline-block border-t border-port-btn transition-all duration-150 group-hover/more:w-8"
              style={{ width: 24 }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
