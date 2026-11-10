import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  src: string;
  slug?: string;
  priority?: boolean;
};

export function CoverImage({ title, src, slug, priority = false }: Props) {
  const image = (
    <Image
      src={src}
      alt={`Cover image for ${title}`}
      width={1300}
      height={630}
      priority={priority}
      className="w-full h-auto object-cover"
    />
  );

  return (
    <div className="rounded-card overflow-hidden">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title} className="block no-underline">
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}

export default CoverImage;