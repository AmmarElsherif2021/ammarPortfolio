type Props = {
  name: string;
  picture?: string | null;
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function Avatar({ name, picture }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="retro-avatar">
        {picture ? (
          <img
            src={picture}
            alt={name}
            className="retro-avatar-img"
          />
        ) : (
          <div className="retro-avatar-fallback">
            <span className="font-display text-2xl font-black text-retro-ink leading-none">
              {getInitial(name)}
            </span>
          </div>
        )}
        <span className="retro-avatar-status" />
      </div>
      <div>
        <p className="font-bold text-retro-base text-retro-ink">{name}</p>
        <p className="font-mono text-retro-xs uppercase tracking-wider opacity-50">
          Author
        </p>
      </div>
    </div>
  );
}

export default Avatar;