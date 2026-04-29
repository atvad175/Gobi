export function Marquee({ items, accent = "purple" }: { items: string[]; accent?: "purple" | "gold" | "ink" }) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple text-purple-foreground",
    gold: "bg-gold text-gold-foreground",
    ink: "bg-ink text-cream",
  };
  const doubled = [...items, ...items, ...items];
  return (
    <div className={`overflow-hidden border-y border-border ${colorMap[accent]}`}>
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {doubled.map((it, i) => (
          <span key={i} className="mx-8 font-serif text-3xl md:text-5xl italic flex items-center gap-8">
            {it}
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
