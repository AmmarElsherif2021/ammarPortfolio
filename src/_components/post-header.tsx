import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/_components/post-title";
import { type User } from "@/domain/entities/User";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: User;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>

      <div className="hidden md:block md:mb-8">
        <Avatar name={author.name} picture={null} />
      </div>

      {/* Cover image — clean border, no comic shadow */}
      <div className="mb-8 md:mb-16 sm:mx-0 border border-port-dark/30 overflow-hidden rounded-none">
        <CoverImage title={title} src={coverImage} />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={null} />
        </div>

        {/* Date — Figma "Body 2" style with a thin top rule */}
        <div className="mb-8 pt-4 border-t border-port-dark/20 flex items-center gap-3">
          {/* Active label pill */}
          <span className="port-label-colorful px-2 py-0 text-[11px] rounded-none">
            Published
          </span>
          <span className="port-body2 text-port-dark">
            <DateFormatter dateString={date} />
          </span>
        </div>
      </div>
    </>
  );
}
