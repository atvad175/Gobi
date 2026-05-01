import { motion } from "framer-motion";
import { Trophy, Medal, Star, Flame, Target, Crown, Lock, Zap } from "lucide-react";

type Badge = {
  icon: React.ReactNode;
  title: string;
  body: string;
  unlocked: boolean;
  date?: string;
};

const BADGES: Badge[] = [
  { icon: <Trophy className="h-7 w-7" />, title: "First Tournament W", body: "Bracket boss energy.", unlocked: true, date: "Oct '25" },
  { icon: <Flame className="h-7 w-7" />, title: "20-Point Game", body: "Buckets in bunches.", unlocked: true, date: "Nov '25" },
  { icon: <Medal className="h-7 w-7" />, title: "Showcase MVP", body: "Game ball, signed.", unlocked: true, date: "Feb '26" },
  { icon: <Target className="h-7 w-7" />, title: "100-Day Gym Streak", body: "Atomic Habits, applied.", unlocked: true, date: "Mar '26" },
  { icon: <Star className="h-7 w-7" />, title: "All-State Selection", body: "On the watchlist.", unlocked: false },
  { icon: <Zap className="h-7 w-7" />, title: "First In-Game Dunk", body: "Coming. Loudly.", unlocked: false },
  { icon: <Crown className="h-7 w-7" />, title: "National MVP", body: "The big one.", unlocked: false },
  { icon: <Trophy className="h-7 w-7" />, title: "Duke Commitment", body: "Cameron Crazies, save a seat.", unlocked: false },
];

export function Achievements() {
  const unlocked = BADGES.filter((b) => b.unlocked).length;
  return (
    <section className="bg-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-10" />
      <div className="aura-blob purple animate-aurora-2" style={{ width: 500, height: 500, bottom: "-10%", right: "5%", opacity: 0.3 }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold mb-3">Trophy Case · Receipts & Reach Goals</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              The <span className="italic text-gold gold-glow">badges.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-cream/70 leading-relaxed mb-4">
              Unlocked: <span className="font-serif text-3xl text-gold tabular-nums">{unlocked}</span>
              <span className="text-cream/50"> / {BADGES.length}</span>
            </p>
            <div className="h-1 bg-cream/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(unlocked / BADGES.length) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
                className="h-full bg-gold"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-cream/10">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`bg-ink p-6 md:p-8 group relative overflow-hidden transition-all ${
                b.unlocked ? "hover:bg-purple/30" : ""
              }`}
            >
              <div className={`relative inline-flex items-center justify-center h-16 w-16 rounded-full ${
                b.unlocked
                  ? "bg-gold text-ink shadow-[0_0_30px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
                  : "bg-cream/5 text-cream/30 border border-cream/10"
              }`}>
                {b.unlocked ? b.icon : <Lock className="h-6 w-6" />}
                {b.unlocked && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-gold/40 animate-pulse-ring" />
                )}
              </div>
              <h3 className={`font-serif text-2xl mt-5 leading-tight ${b.unlocked ? "" : "text-cream/40"}`}>
                {b.title}
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${b.unlocked ? "text-cream/60" : "text-cream/30 italic"}`}>
                {b.body}
              </p>
              {b.unlocked && b.date && (
                <p className="eyebrow text-gold/80 mt-4 text-[0.6rem]">Unlocked · {b.date}</p>
              )}
              {!b.unlocked && (
                <p className="eyebrow text-cream/30 mt-4 text-[0.6rem]">Locked · loading…</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
