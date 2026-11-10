export function SectionSeparator() {
  return (
    <div className="my-8 flex items-center gap-0">
      <div className="h-2 flex-1 bg-retro-yellow border-y-2 border-retro-navy" />
      <div
        className="w-8 h-2 border-y-2 border-retro-navy"
        style={{
          backgroundImage: "repeating-conic-gradient(#0D0D2B 0% 25%, transparent 0% 50%)",
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
}