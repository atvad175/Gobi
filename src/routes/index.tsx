import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/gobi-hero.jpg";
import actionImg from "@/assets/gobi-action.jpg";
import courtImg from "@/assets/court.jpg";
import signature from "@/assets/signature.png";
import { ArrowUpRight, Trophy, BookOpen, GraduationCap, Award, Dumbbell, Quote, Flame } from "lucide-react";
import { Marquee } from "@/components/Marquee";
import { BasketballSVG } from "@/components/Basketball";

export const Route = createFileRoute("/")({ component: Home });

const MARQUEE = [
  "Hooper",
  "Scholar",
  "Future Ivy",
  "No. 24",
  "Mamba Mentality",
  "Forever Lakers",
  "Class of 2029",
];

const PRINCIPLES = [
  { n: "01", t: "The work is the reward.", b: "Reps before rings. The score takes care of itself." },
  { n: "02", t: "Mind sharper than the body.", b: "Film, books, journals. Game IQ is a daily deposit." },
  { n: "03", t: "Detail is destiny.", b: "Footwork, follow-through, free throws. The boring stuff wins games." },
  { n: "04", t: "Be the one they trust.", b: "Last shot, last possession, last to leave the gym." },
];

function Home() {
  const [counts, setCounts] = useState({ tournaments: 0, journal: 0, college: 0, comps: 0, training: 0 });
  const [averages, setAverages] = useState({ ppg: 0, rpg: 0, apg: 0, games: 0 });
  const [latest, setLatest] = useState<{ title: string; body: string | null; entry_date: string; mood: string | null } | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("tournaments").select("*"),
      supabase.from("journal_entries").select("*", { count: "exact" }).order("entry_date", { ascending: false }).limit(1),
      supabase.from("college_notes").select("*", { count: "exact", head: true }),
      supabase.from("competitions").select("*", { count: "exact", head: true }),
      supabase.from("training_logs").select("*", { count: "exact", head: true }),
    ]).then(([t, j, c, cm, tr]) => {
      const tournaments = (t.data ?? []) as Array<{ points: number | null; rebounds: number | null; assists: number | null }>;
      const games = tournaments.length;
      const sum = (k: "points" | "rebounds" | "assists") =>
        tournaments.reduce((acc, x) => acc + (x[k] ?? 0), 0);
      setAverages({
        ppg: games ? +(sum("points") / games).toFixed(1) : 0,
        rpg: games ? +(sum("rebounds") / games).toFixed(1) : 0,
        apg: games ? +(sum("assists") / games).toFixed(1) : 0,
        games,
      });
      setCounts({
        tournaments: games,
        journal: j.count ?? 0,
        college: c.count ?? 0,
        comps: cm.count ?? 0,
        training: tr.count ?? 0,
      });
      if (j.data && j.data[0]) setLatest(j.data[0] as any);
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 grain pointer-events-none" />
        <BasketballSVG className="absolute -right-20 top-10 w-96 text-purple/10 animate-spin-slow hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 lg:pt-16 pb-20 grid lg:grid-cols-12 gap-10 items-end relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-purple" />
              <p className="eyebrow text-purple">No. 24 · Class of 2029 · Guard</p>
            </div>
            <h1 className="display font-serif text-[clamp(3.5rem,12vw,10rem)] text-foreground">
              Gobi.
              <br />
              <span className="italic text-purple">Built for</span>
              <br />
              <span className="text-stroke">the moment.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              National-level basketball player. Ninth-grade scholar. Future Ivy.
              <br className="hidden sm:block" />
              This is the notebook, the highlight reel, and the long game — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/tournaments" className="group inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 text-sm tracking-wide hover:bg-purple transition-colors">
                See the season
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/journal" className="inline-flex items-center gap-3 border border-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-foreground transition-colors">
                Read the journal
              </Link>
            </div>

            {/* Mini stats inline */}
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md border-t border-border pt-6">
              <MiniStat label="PPG" value={averages.ppg || "—"} />
              <MiniStat label="RPG" value={averages.rpg || "—"} />
              <MiniStat label="APG" value={averages.apg || "—"} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink shadow-elegant">
              <img src={heroImg} alt="Gobi in her Lakers jersey holding a basketball" className="absolute inset-0 w-full h-full object-cover" width={1080} height={1350} />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink/95 to-transparent">
                <p className="eyebrow text-gold">Cover Athlete · 2026</p>
                <p className="font-serif text-cream text-2xl mt-1 italic">"The work is the reward."</p>
              </div>
              <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur px-3 py-2 text-xs eyebrow text-ink flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> LIVE
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-gold text-gold-foreground px-4 py-2 eyebrow shadow-card hidden md:block rotate-[-3deg]">
              Birthday Edition
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:flex items-center justify-center w-28 h-28 rounded-full bg-purple text-cream animate-spin-slow">
              <span className="font-serif text-xs tracking-[0.3em]">· GOBI · 24 · GOBI · 24 ·</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={MARQUEE} accent="ink" />

      {/* SEASON SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <p className="eyebrow text-muted-foreground mb-3">The Tale of the Tape</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              By the <span className="italic text-purple">numbers.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-muted-foreground leading-relaxed">
            A living scoreboard. Every tournament logged, every entry counted, every school tracked. The portfolio updates itself.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-border">
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Tournaments" value={counts.tournaments} to="/tournaments" />
          <StatCard icon={<Dumbbell className="h-5 w-5" />} label="Training Logs" value={counts.training} to="/training" />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Journal Entries" value={counts.journal} to="/journal" />
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Schools" value={counts.college} to="/college" />
          <StatCard icon={<Award className="h-5 w-5" />} label="Competitions" value={counts.comps} to="/competitions" />
        </div>
      </section>

      {/* PRINCIPLES MANIFESTO */}
      <section className="bg-ink text-cream relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <p className="eyebrow text-gold mb-6">The Code · Mamba Rules</p>
          <h2 className="font-serif text-5xl md:text-8xl leading-[0.92] max-w-5xl">
            Four rules. <span className="italic text-gold">No exceptions.</span>
          </h2>
          <div className="mt-16 grid md:grid-cols-2 gap-px bg-cream/15">
            {PRINCIPLES.map((p) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="bg-ink p-8 md:p-12 group"
              >
                <p className="font-serif text-6xl text-gold/60 group-hover:text-gold transition-colors">{p.n}</p>
                <h3 className="font-serif text-3xl mt-4 italic">{p.t}</h3>
                <p className="text-sm text-cream/70 mt-3 leading-relaxed">{p.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOURNAL + IMAGE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] overflow-hidden bg-ink stripe-bg">
            <img src={actionImg} alt="Gobi posing with basketball" className="w-full h-full object-cover" loading="lazy" width={1024} height={1280} />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-cream border border-border px-5 py-4 shadow-card">
            <p className="eyebrow text-purple">From the journal</p>
            <p className="font-serif text-xl mt-1 italic">"Today felt different."</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow text-muted-foreground mb-4">
            <Quote className="inline h-3.5 w-3.5 mr-2" /> Latest entry
          </p>
          {latest ? (
            <>
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] italic">{latest.title}</h2>
              <p className="mt-2 eyebrow text-purple">{latest.mood} · {new Date(latest.entry_date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</p>
              {latest.body && <p className="mt-6 text-lg text-foreground/85 leading-relaxed line-clamp-6 whitespace-pre-wrap">{latest.body}</p>}
              <Link to="/journal" className="mt-8 inline-flex items-center gap-2 eyebrow text-purple hover:text-foreground">
                Read all entries <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] italic">The notebook is open.</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                First entry coming soon. The journal is where the work meets the meaning — practices, doubts, breakthroughs, prayers, plans.
              </p>
              <Link to="/journal" className="mt-8 inline-flex items-center gap-2 eyebrow text-purple hover:text-foreground">
                Open the journal <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* QUICK LINKS — magazine cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-4xl md:text-6xl">The sections.</h2>
          <p className="eyebrow text-muted-foreground hidden md:block">Pick a chapter</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <FeatureCard to="/tournaments" eyebrow="On the court" title="Tournament reviews" body="Every game charted. Box scores, results, and the story behind them." />
          <FeatureCard to="/training" eyebrow="In the gym" title="Training log" body="Daily reps, weekly heat-map, and the streak that doesn't break." />
          <FeatureCard to="/college" eyebrow="The long game" title="College notebook" body="Ivy, Top 20, dream schools. Visits, deadlines, and the why behind each." />
          <FeatureCard to="/competitions" eyebrow="Stage-ready" title="Competitions" body="Showcases, AAU brackets, scholarships. The pipeline that gets you seen." />
          <FeatureCard to="/highlights" eyebrow="Wall of fame" title="Highlights" body="Quotes that hit. Mentions. The receipts of the rise." />
          <FeatureCard to="/journal" eyebrow="Mind & mindset" title="Journal" body="The notebook. Mood-tagged. Searchable. Honest." />
        </div>
      </section>

      {/* PARALLAX QUOTE */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={courtImg} alt="" loading="lazy" className="w-full h-full object-cover opacity-30" width={1600} height={900} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-32 lg:py-40 text-cream">
          <Flame className="h-10 w-10 text-gold mb-6" />
          <h2 className="font-serif text-4xl md:text-7xl max-w-4xl leading-[1.05]">
            "Heroes come and go, <span className="italic text-gold">but legends are forever.</span>"
          </h2>
          <p className="eyebrow text-cream/60 mt-8">— Kobe Bryant · taped above the desk</p>

          <div className="mt-16 max-w-md">
            <img src={signature} alt="Gobi signature" loading="lazy" className="h-20 w-auto invert opacity-90" width={1024} height={512} />
            <p className="eyebrow text-gold mt-2">Always working · 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="font-serif text-4xl text-foreground">{value}</p>
      <p className="eyebrow text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function StatCard({ icon, label, value, to }: { icon: React.ReactNode; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="bg-background p-8 hover:bg-card transition-colors group relative overflow-hidden">
      <div className="flex items-center justify-between text-muted-foreground">
        {icon}
        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-serif text-6xl mt-6 text-foreground">{value.toString().padStart(2, "0")}</p>
      <p className="eyebrow text-muted-foreground mt-2">{label}</p>
      <div className="absolute -bottom-6 -right-6 w-20 h-1 bg-purple opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500" />
    </Link>
  );
}

function FeatureCard({ to, eyebrow, title, body }: { to: string; eyebrow: string; title: string; body: string }) {
  return (
    <Link to={to} className="group block border border-border bg-card p-8 hover:border-purple hover:shadow-card transition-all relative overflow-hidden">
      <p className="eyebrow text-purple">{eyebrow}</p>
      <h3 className="font-serif text-3xl mt-4 group-hover:italic transition-all">{title}</h3>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{body}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm">
        Open <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Link>
  );
}
