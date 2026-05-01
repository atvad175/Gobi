import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

type Track = { title: string; artist: string; mood: string; len: string };

const TRACKS: Track[] = [
  { title: "Sicko Mode", artist: "Travis Scott", mood: "Layup line", len: "5:12" },
  { title: "Till I Collapse", artist: "Eminem", mood: "4th quarter", len: "4:58" },
  { title: "POWER", artist: "Kanye West", mood: "Tip-off", len: "4:52" },
  { title: "Lose Yourself", artist: "Eminem", mood: "Big game", len: "5:26" },
  { title: "Run This Town", artist: "Jay-Z, Rihanna, Ye", mood: "Walk in", len: "4:27" },
  { title: "GOD DID", artist: "DJ Khaled", mood: "Post-W", len: "8:00" },
];

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-1 h-6 w-8">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="block w-1 bg-gold"
          animate={active ? { height: ["20%", "100%", "40%", "80%", "30%"] } : { height: "30%" }}
          transition={active ? { duration: 0.9 + i * 0.15, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export function HypePlaylist() {
  return (
    <section className="bg-gradient-to-br from-purple via-ink to-purple text-cream relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-10" />
      <div className="aura-blob gold animate-aurora" style={{ width: 600, height: 600, bottom: "-20%", left: "-10%", opacity: 0.3 }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <Music2 className="h-5 w-5 text-gold" />
              <p className="eyebrow text-gold">Pre-Game · Locker Room Loud</p>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              The <span className="italic text-gold gold-glow">hype tape.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-cream/70 leading-relaxed">
            Headphones in. World out. The exact rotation between the bus and the bench. Press play in your head.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-cream/15">
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-ink/80 backdrop-blur p-6 md:p-7 group hover:bg-ink/95 transition-colors flex items-center gap-5"
            >
              <div className="font-serif text-3xl text-gold/50 group-hover:text-gold tabular-nums w-10">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Equalizer active={i === 0} />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-2xl truncate">{t.title}</p>
                <p className="text-sm text-cream/60 truncate">{t.artist}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="eyebrow text-gold/80 text-[0.65rem]">{t.mood}</p>
                <p className="text-xs text-cream/50 tabular-nums mt-1">{t.len}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center eyebrow text-cream/60">
          ✦ Volume: yes ✦ Repeat: forever ✦ Skip: never ✦
        </p>
      </div>
    </section>
  );
}
