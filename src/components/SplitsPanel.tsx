import { motion } from "framer-motion";

type Split = { label: string; pct: number; made: number; att: number; tone: "gold" | "purple" | "cream" };

const SPLITS: Split[] = [
  { label: "Field Goal %", pct: 48, made: 96, att: 200, tone: "gold" },
  { label: "Three Point %", pct: 38, made: 38, att: 100, tone: "purple" },
  { label: "Free Throw %", pct: 82, made: 82, att: 100, tone: "cream" },
  { label: "Effective FG %", pct: 53, made: 0, att: 0, tone: "gold" },
];

const ZONES = [
  { name: "Paint", pct: 62, x: 50, y: 78 },
  { name: "Mid-range", pct: 41, x: 28, y: 60 },
  { name: "Wing 3", pct: 39, x: 78, y: 50 },
  { name: "Top of Key", pct: 36, x: 50, y: 36 },
  { name: "Corner 3", pct: 44, x: 12, y: 86 },
];

function toneClass(t: Split["tone"]) {
  if (t === "gold") return "text-gold";
  if (t === "purple") return "text-purple";
  return "text-cream";
}
function toneBar(t: Split["tone"]) {
  if (t === "gold") return "bg-gold";
  if (t === "purple") return "bg-purple";
  return "bg-cream";
}

export function SplitsPanel() {
  return (
    <section className="bg-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-10" />
      <div className="aura-blob gold animate-aurora-2" style={{ width: 520, height: 520, top: "-15%", right: "-10%", opacity: 0.25 }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold mb-3">Film Room · Shot Profile</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              Where the <span className="italic text-gold gold-glow">buckets</span> come from.
            </h2>
          </div>
          <p className="lg:col-span-5 text-cream/70 leading-relaxed">
            Charted across the season. The hot zones tell the story before the box score does.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Splits bars */}
          <div className="lg:col-span-5 space-y-8">
            {SPLITS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <p className="eyebrow text-cream/60">{s.label}</p>
                  <p className={`font-serif text-4xl tabular-nums ${toneClass(s.tone)}`}>
                    {s.pct}<span className="text-xl text-cream/40">%</span>
                  </p>
                </div>
                <div className="h-1.5 w-full bg-cream/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 + i * 0.1 }}
                    className={`h-full ${toneBar(s.tone)}`}
                  />
                </div>
                {s.att > 0 && (
                  <p className="mt-2 text-xs text-cream/40 tabular-nums">
                    {s.made} / {s.att} attempts
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Half-court SVG with hot zones */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] bg-ink border border-cream/10 overflow-hidden">
              <div className="absolute inset-0 court-grid opacity-50" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* Half-court outline */}
                <rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" className="text-gold/60" strokeWidth="0.4" />
                {/* Free throw lane */}
                <rect x="35" y="62" width="30" height="36" fill="none" stroke="currentColor" className="text-gold/50" strokeWidth="0.3" />
                {/* Free throw circle */}
                <circle cx="50" cy="62" r="9" fill="none" stroke="currentColor" className="text-gold/50" strokeWidth="0.3" />
                {/* 3-point arc */}
                <path d="M 8,98 L 8,72 A 42 42 0 0 1 92,72 L 92,98" fill="none" stroke="currentColor" className="text-gold/60" strokeWidth="0.3" />
                {/* Hoop */}
                <circle cx="50" cy="92" r="2.2" fill="none" stroke="currentColor" className="text-gold" strokeWidth="0.5" />
              </svg>

              {/* Hot zones */}
              {ZONES.map((z, i) => (
                <motion.div
                  key={z.name}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 180 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                >
                  <div className="relative">
                    <div
                      className={`rounded-full ${z.pct >= 50 ? "bg-gold" : z.pct >= 40 ? "bg-purple" : "bg-cream/70"} animate-pulse-ring`}
                      style={{ width: `${24 + z.pct / 2}px`, height: `${24 + z.pct / 2}px`, opacity: 0.55 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-sm tabular-nums text-cream">{z.pct}%</span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap eyebrow text-cream/70 text-[0.6rem]">
                      {z.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-xs eyebrow text-cream/60">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold" /> 50%+</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-purple" /> 40–49%</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cream/70" /> Sub-40%</span>
              <span className="ml-auto">Updated each tournament · live from logs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
