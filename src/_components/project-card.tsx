import Image from "next/image";
import { type ProjectCard as ProjectCardType } from "@/domain/entities/Project";

type Variant = "colorful" | "powerful" | "beautiful";

const VARIANTS: Record<Variant, { bg: string; label: string }> = {
  colorful: { bg: "bg-retro-tint-3", label: "Colorful" },
  powerful: { bg: "bg-retro-tint-4", label: "Powerful" },
  beautiful: { bg: "bg-retro-tint-5", label: "Beautiful" },
};

const ORDER: Variant[] = ["colorful", "powerful", "beautiful"];

type Props = {
  project: ProjectCardType;
  variant?: Variant;
};

export function ProjectCard({ project, variant }: Props) {
  const {
    title,
    description,
    image_url,
    tech_stack,
    featured,
    live_url,
    github_url,
  } = project;

  const resolvedVariant = variant ?? ORDER[project.id % ORDER.length];
  const { bg, label } = VARIANTS[resolvedVariant];

  return (
    <article className={`retro-card flex flex-col h-full ${bg} min-h-[280px]`}>
      {featured && (
        <span className="absolute top-3 right-3 retro-badge bg-retro-red text-retro-cream border-retro-ink">
          Featured
        </span>
      )}

      {image_url && (
        <div className="relative w-full h-36 border-b-2 border-retro-ink">
          <Image
            src={image_url}
            alt={`Preview of ${title}`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="retro-card-body flex flex-col gap-3 flex-1">
        <h3 className="font-display text-retro-lg font-black text-retro-ink">
          {title}
        </h3>

        {description && (
          <p className="font-body text-retro-base text-retro-ink/80 line-clamp-3">
            {description}
          </p>
        )}

        {tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tech_stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-retro-xs font-bold uppercase tracking-wider bg-retro-ink/10 px-2 py-1 rounded-retro border border-retro-ink/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-3 border-t-2 border-retro-ink/20">
          {live_url && (
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn text-retro-ink bg-retro-gold hover:opacity-80"
            >
              Live ↗
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn text-retro-cream bg-retro-ink hover:opacity-80"
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
