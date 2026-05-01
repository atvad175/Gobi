import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Voice = { quote: string; who: string; role: string; tone: "ink" | "purple" | "gold" | "cream" };

const VOICES: Voice[] = [
  {
    quote: "She doesn't ask for the ball. She demands it. Then she earns the next one.",
    who: "Coach R.",
    role: "Head Coach · Varsity",
    tone: "ink",
  },
  {
    quote: "Aanya plans practice like it's a job interview. Then plays like she got the offer.",
    who: "Mom",
    role: "First fan · Loudest in the gym",
    tone: "purple",
  },
  {
    quote: "Bro she's annoying in 1-on-1. But like… in a good way. (Don't tell her I said that.)",
    who: "Nikash",
    role: "Little brother · Off the record",
    tone: "gold",
  },
  {
    quote: "Highest IQ on the floor. Reads two passes ahead. Coaches dream of kids like her.",
    who: "Showcase Scout",
    role: "Anonymous · for now",
    tone: "cream",
  },
  {
    quote: "She makes the timetable. Then we all follow it. It's annoying. It works.",
    who: "Pickleball Crew",
    role: "Doubles partners · Sundays",
    tone: "ink",
  },
];

function styleFor(t: Voice["tone"]) {
  switch (t) {
    case "purple": return "bg-purple text-cream border-purple";
    case "gold":   return "bg-gold text-ink border-gold";
    case "cream":  return "bg-cream text-ink border-border";
    default:       return "bg-ink text-cream border-ink";
  }
}

export function Testimonials() {
  return (
    <section className="bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <p className="eyebrow text-purple mb-3">Word on the Court</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              What they're <span className="italic text-purple">saying.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-muted-foreground leading-relaxed">
            Coaches, family, scouts, and the pickleball crew. Receipts from the people who actually watch.
          </p>
        </div>

        <div className="grid md:grid-cols-6 gap-4 md:gap-5">
          {VOICES.map((v, i) => {
            // Asymmetric span layout
            const span = i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2" : i === 2 ? "md:col-span-2" : i === 3 ? "md:col-span-2" : "md:col-span-2";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative p-7 md:p-9 border shadow-card ${styleFor(v.tone)} ${span}`}
              >
                <Quote className="h-6 w-6 opacity-40 mb-4" />
                <p className="font-serif text-2xl md:text-3xl italic leading-snug">"{v.quote}"</p>
                <div className="mt-6 pt-4 border-t border-current/15">
                  <p className="eyebrow opacity-90">{v.who}</p>
                  <p className="text-xs opacity-70 mt-1">{v.role}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
