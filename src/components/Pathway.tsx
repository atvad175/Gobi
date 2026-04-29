import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Trophy, MapPin } from "lucide-react";

export type PathStop = {
  id: string;
  name: string;
  stage: string | null;
  date: string | null;
  location: string | null;
  result: string | null;
  cover?: string | null;
};

const STAGE_COLOR: Record<string, string> = {
  district: "bg-purple/80",
  state: "bg-purple",
  nationals: "bg-gold",
  showcase: "bg-cream",
};

export function Pathway({ stops }: { stops: PathStop[] }) {
  if (!stops.length) return null;
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px pathway-line -translate-x-1/2 hidden md:block" />
      <ol className="space-y-12 md:space-y-20">
        {stops.map((s, i) => {
          const left = i % 2 === 0;
          const win = (s.result ?? "").toLowerCase().startsWith("w");
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${left ? "" : "md:[&>*:first-child]:order-2"}`}
            >
              <Link to="/tournaments" className="block group">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  {s.cover ? (
                    <img src={s.cover} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-royal flex items-center justify-center">
                      <Trophy className="h-16 w-16 text-gold/60" />
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 ${STAGE_COLOR[s.stage ?? "district"]} text-cream eyebrow text-[0.65rem] px-2.5 py-1`}>
                    {s.stage ?? "District"}
                  </div>
                </div>
              </Link>

              <div className={left ? "md:pl-8 mt-6 md:mt-0" : "md:pr-8 md:text-right mt-6 md:mt-0"}>
                <p className="eyebrow text-purple">Stop {String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif text-3xl md:text-5xl mt-2 leading-tight">{s.name}</h3>
                <div className={`mt-3 flex flex-wrap gap-3 text-xs eyebrow text-muted-foreground ${left ? "" : "md:justify-end"}`}>
                  {s.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {s.location}</span>}
                  {s.date && <span>{new Date(s.date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>}
                </div>
                {s.result && (
                  <p className={`mt-4 font-serif text-2xl ${win ? "text-purple" : "text-muted-foreground"}`}>{s.result}</p>
                )}
              </div>

              {/* Center node */}
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className={`h-5 w-5 rounded-full ${STAGE_COLOR[s.stage ?? "district"]} ring-4 ring-background animate-pulse-ring`} />
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
