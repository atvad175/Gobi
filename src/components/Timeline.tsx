import { motion } from "framer-motion";

type Chapter = { month: string; title: string; body: string; tag: string };

const CHAPTERS: Chapter[] = [
  { month: "Jun 2025", tag: "Reset", title: "Off-season starts in pain.", body: "Two-a-days. Form shooting. 500 makes a day. Nobody's clapping yet — that's the point." },
  { month: "Aug 2025", tag: "Camp", title: "Elite camp invite.", body: "First time being the youngest in the room. Took notes. Took numbers. Took souls in the 1-on-1." },
  { month: "Oct 2025", tag: "Tip-off", title: "Season opener.", body: "Dropped 22 in the first quarter. Coach pulled me. 'Save some for the playoffs.'" },
  { month: "Dec 2025", tag: "Grind", title: "Finals + ball + Atomic Habits.", body: "GPA up. Vertical up. Sleep down. Re-read the chapter on identity-based habits." },
  { month: "Feb 2026", tag: "Stage", title: "First showcase MVP.", body: "Three coaches asked for the highlight tape. Mom cried. Nikash pretended he didn't." },
  { month: "Apr 2026", tag: "Birthday", title: "Site goes live. 🎂", body: "This page right here. The receipts start now." },
];

export function Timeline() {
  return (
    <section className="bg-cream text-ink relative overflow-hidden">
      <div className="absolute inset-0 stripe-bg opacity-30" />
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="eyebrow text-purple mb-3">Year in Motion · 2025 → 2026</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              The chapters, <span className="italic text-purple">in order.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-muted-foreground leading-relaxed">
            A scrollable receipt of the year. Every season has a story arc — this one's mine.
          </p>
        </div>

        <div className="relative">
          {/* Center spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple/40 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-20">
            {CHAPTERS.map((c, i) => {
              const right = i % 2 === 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${right ? "" : ""}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-purple ring-4 ring-cream" />
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-purple animate-ping opacity-40" />
                    </div>
                  </div>

                  {/* Date side */}
                  <div className={`pl-12 md:pl-0 ${right ? "md:order-2 md:pl-12" : "md:pr-12 md:text-right"}`}>
                    <p className="eyebrow text-purple">{c.tag}</p>
                    <p className="font-serif text-3xl md:text-4xl mt-1 italic">{c.month}</p>
                  </div>

                  {/* Card side */}
                  <div className={`pl-12 md:pl-0 ${right ? "md:order-1 md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-card border border-border p-6 md:p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
                      <h3 className="font-serif text-2xl md:text-3xl leading-tight">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
