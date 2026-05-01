import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/gobi-hero.jpg";
import actionImg from "@/assets/gobi-action.jpg";
import courtImg from "@/assets/court.jpg";
import signature from "@/assets/signature.png";
import { ArrowUpRight, Trophy, BookOpen, GraduationCap, Award, Dumbbell, Quote, Flame, Sparkles, Zap } from "lucide-react";
import { Marquee } from "@/components/Marquee";
import { BasketballSVG } from "@/components/Basketball";
import { AuroraBackground } from "@/components/AuroraBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { CountUp } from "@/components/CountUp";
import { QuoteRotator } from "@/components/QuoteRotator";
import { NextGameCountdown } from "@/components/NextGameCountdown";
import { Pathway, PathStop } from "@/components/Pathway";
import { publicUrl } from "@/components/PhotoUpload";
import { SplitsPanel } from "@/components/SplitsPanel";
import { Timeline } from "@/components/Timeline";
import { HypePlaylist } from "@/components/HypePlaylist";
import { Testimonials } from "@/components/Testimonials";
import { Achievements } from "@/components/Achievements";

export const Route = createFileRoute("/")({ component: Home });

const MARQUEE = [
  "Aanya", "aka Gobi", "Meanie", "Duke Bound",
  "Atomic Habits", "Forever Lakers", "Pickleball Champ",
  "Can't Dunk… yet", "Class of 2030", "Bumpy Kars Crew",
  "Timetable Tyrant", "Nikash's Big Sis Energy",
];

const PRINCIPLES = [
  { n: "01", t: "1% better. Every single day.", b: "Atomic Habits in the gym, in the books, in the kitchen. Compound the small stuff." },
  { n: "02", t: "Timetables aren't cute. They're cheat codes.", b: "Plan the week like a coach plans a playoff run. Then run the play." },
  { n: "03", t: "Can't dunk yet ≠ won't dunk ever.", b: "Today's ceiling is tomorrow's floor. Keep stacking inches — vertical, GPA, life." },
  { n: "04", t: "Be the one Nikash brags about.", b: "Little brothers are watching. Big sisters set the tone. Show up loud.", whisper: "Nikash is watchingggg 👀" },
];

type MVP = { id: string; tournament_id: string; storage_path: string; caption: string | null; tournament: { name: string; date: string | null; result: string | null } | null };

function Home() {
  const [counts, setCounts] = useState({ tournaments: 0, journal: 0, college: 0, comps: 0, training: 0 });
  const [averages, setAverages] = useState({ ppg: 0, rpg: 0, apg: 0, games: 0 });
  const [latest, setLatest] = useState<{ title: string; body: string | null; entry_date: string; mood: string | null } | null>(null);
  const [mvp, setMvp] = useState<MVP | null>(null);
  const [pathway, setPathway] = useState<PathStop[]>([]);
  const [nextGame, setNextGame] = useState<{ name: string; tip_off: string } | null>(null);
  const [careerPoints, setCareerPoints] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from("tournaments").select("*").order("date", { ascending: true }),
      supabase.from("journal_entries").select("*", { count: "exact" }).order("entry_date", { ascending: false }).limit(1),
      supabase.from("college_notes").select("*", { count: "exact", head: true }),
      supabase.from("competitions").select("*", { count: "exact", head: true }),
      supabase.from("training_logs").select("*", { count: "exact", head: true }),
      supabase.from("tournament_photos").select("*, tournament:tournaments(name,date,result)").eq("is_mvp_moment", true).order("created_at", { ascending: false }).limit(1),
      supabase.from("tournament_photos").select("tournament_id, storage_path, is_cover, created_at"),
    ]).then(([t, j, c, cm, tr, mvpRes, photoRes]) => {
      const tournaments = (t.data ?? []) as any[];
      const games = tournaments.length;
      const sum = (k: "points" | "rebounds" | "assists") =>
        tournaments.reduce((acc, x) => acc + (x[k] ?? 0), 0);
      setAverages({
        ppg: games ? +(sum("points") / games).toFixed(1) : 0,
        rpg: games ? +(sum("rebounds") / games).toFixed(1) : 0,
        apg: games ? +(sum("assists") / games).toFixed(1) : 0,
        games,
      });
      setCareerPoints(sum("points"));
      setCounts({
        tournaments: games,
        journal: j.count ?? 0,
        college: c.count ?? 0,
        comps: cm.count ?? 0,
        training: tr.count ?? 0,
      });
      if (j.data && j.data[0]) setLatest(j.data[0] as any);
      if (mvpRes.data && mvpRes.data[0]) setMvp(mvpRes.data[0] as any);

      // Cover map (tournament_id → first cover or first photo)
      const photoMap = new Map<string, string>();
      const sorted = (photoRes.data ?? []).sort((a: any, b: any) =>
        Number(b.is_cover) - Number(a.is_cover) || a.created_at.localeCompare(b.created_at)
      );
      sorted.forEach((p: any) => {
        if (!photoMap.has(p.tournament_id)) photoMap.set(p.tournament_id, publicUrl(p.storage_path));
      });

      // Pathway: most recent 5 played, oldest first
      const played = tournaments.filter((x) => !x.is_upcoming).slice(-5);
      setPathway(played.map((x) => ({
        id: x.id, name: x.name, stage: x.stage, date: x.date,
        location: x.location, result: x.result,
        cover: photoMap.get(x.id) ?? null,
      })));

      // Next upcoming
      const upcoming = tournaments
        .filter((x) => x.tip_off && new Date(x.tip_off).getTime() > Date.now())
        .sort((a, b) => new Date(a.tip_off).getTime() - new Date(b.tip_off).getTime())[0];
      if (upcoming) setNextGame({ name: upcoming.name, tip_off: upcoming.tip_off });
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      <CursorGlow tone="gold" />

      {/* HERO — AURA MODE */}
      <section className="relative bg-ink text-cream isolate">
        <AuroraBackground />
        <div className="absolute inset-0 grain opacity-[0.07] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-24 grid lg:grid-cols-12 gap-10 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <p className="eyebrow text-gold">Aanya · aka Gobi · No. 24 · Class of 2030 · Duke Bound</p>
            </div>

            <h1 className="display font-serif text-[clamp(3.5rem,12vw,11rem)] leading-[0.88]">
              <span className="block gold-glow">Gobi.</span>
              <span className="block italic text-cream/90">Meanie on the court,</span>
              <span className="block shine">scholar off it.</span>
            </h1>

            <p className="mt-8 text-lg text-cream/75 max-w-xl leading-relaxed">
              Hi, I'm <span className="text-gold">Aanya</span> — but everyone calls me Gobi. National hooper, 9th-grade overthinker, future <span className="italic text-gold">Duke Blue Devil</span> (or Ivy, we'll see who wants me more). <br className="hidden sm:block" />
              This is my notebook, my highlight reel, and my receipts — all in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link to="/tournaments" className="group inline-flex items-center gap-3 bg-gold text-gold-foreground px-7 py-4 text-sm tracking-wide hover:bg-cream transition-colors shadow-elegant">
                See the season
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/journal" className="inline-flex items-center gap-3 border border-cream/30 px-7 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors">
                Read the journal
              </Link>
              {nextGame && <NextGameCountdown tipOff={nextGame.tip_off} name={nextGame.name} />}
            </div>

            {/* Mini live stats — count up */}
            <div className="mt-14 grid grid-cols-4 gap-6 max-w-2xl border-t border-cream/15 pt-6">
              <MiniStat label="PPG" value={<CountUp to={averages.ppg} decimals={1} />} accent />
              <MiniStat label="RPG" value={<CountUp to={averages.rpg} decimals={1} />} />
              <MiniStat label="APG" value={<CountUp to={averages.apg} decimals={1} />} />
              <MiniStat label="Career PTS" value={<CountUp to={careerPoints} />} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glowing aura behind portrait */}
            <div className="absolute -inset-8 bg-gradient-to-br from-purple via-gold/40 to-purple blur-3xl opacity-60 animate-glow-pop rounded-full" />

            <div className="relative aspect-[4/5] overflow-hidden bg-ink shadow-elegant">
              <img src={heroImg} alt="Gobi in her Lakers jersey holding a basketball" className="absolute inset-0 w-full h-full object-cover" width={1080} height={1350} />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent">
                <p className="eyebrow text-gold">Cover Athlete · Birthday Edition</p>
                <p className="font-serif text-cream text-2xl mt-1 italic">"Can't dunk yet. Still your problem."</p>
              </div>
              <div className="absolute top-4 right-4 glass-dark px-3 py-2 text-xs eyebrow text-cream flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-ring" /> LIVE
              </div>
            </div>
            <motion.div
              initial={{ rotate: -3 }}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 bg-gold text-gold-foreground px-4 py-2 eyebrow shadow-card hidden md:block"
            >
              ✦ Birthday Edition ✦
            </motion.div>
            <div className="absolute -bottom-6 -right-6 hidden md:flex items-center justify-center w-28 h-28 rounded-full bg-purple text-cream animate-spin-slow">
              <span className="font-serif text-xs tracking-[0.3em]">· GOBI · 24 · GOBI · 24 ·</span>
            </div>
            <BasketballSVG className="absolute -bottom-8 -left-10 w-24 text-gold animate-ball-bounce hidden lg:block" />
          </motion.div>
        </div>

        {/* Quote rotator strip */}
        <div className="relative z-10 border-t border-cream/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-gold" />
              <p className="eyebrow text-gold">Daily Fuel</p>
            </div>
            <div className="md:col-span-9">
              <QuoteRotator className="text-cream" />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={MARQUEE} accent="ink" />

      {/* MVP MOMENT — only if a photo is starred */}
      {mvp && (
        <section className="bg-ink text-cream relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-10" />
          <div className="aura-blob gold animate-aurora-2" style={{ width: 500, height: 500, top: "20%", right: "5%", opacity: 0.4 }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10 items-center relative">
            <div className="lg:col-span-7 relative">
              <div className="absolute -top-6 -left-6 bg-gold text-gold-foreground px-4 py-2 eyebrow z-10 rotate-[-3deg]">
                <Zap className="inline h-3 w-3 mr-1.5" /> MVP Moment
              </div>
              <div className="aspect-[16/10] overflow-hidden shadow-elegant">
                <img src={publicUrl(mvp.storage_path)} alt={mvp.caption ?? "MVP moment"} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow text-gold">The frame</p>
              <h2 className="font-serif text-4xl md:text-6xl mt-3 italic leading-tight">
                {mvp.caption ?? "The shot that mattered."}
              </h2>
              {mvp.tournament && (
                <>
                  <div className="mt-6 rule" />
                  <p className="mt-6 eyebrow text-cream/60">{mvp.tournament.name}</p>
                  <p className="font-serif text-2xl mt-1">{mvp.tournament.result ?? "—"}</p>
                  {mvp.tournament.date && <p className="text-sm text-cream/60 mt-1">{new Date(mvp.tournament.date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</p>}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEASON SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <p className="eyebrow text-purple mb-3">The Tale of the Tape</p>
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

      {/* SHOT PROFILE */}
      <SplitsPanel />
      {pathway.length > 0 && (
        <section className="bg-gradient-to-b from-background to-secondary/40 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
            <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
              <div className="lg:col-span-8">
                <p className="eyebrow text-purple mb-3">The Road So Far</p>
                <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
                  The <span className="italic text-purple">pathway.</span>
                </h2>
              </div>
              <p className="lg:col-span-4 text-muted-foreground leading-relaxed">
                District. State. Nationals. Showcases. Every stop on the road from Bangalore courts to the Ivy League gym.
              </p>
            </div>
            <Pathway stops={pathway} />
            <div className="mt-12 text-center">
              <Link to="/tournaments" className="inline-flex items-center gap-2 eyebrow text-purple hover:text-foreground">
                See every stop · bracket + galleries <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* YEAR IN MOTION */}
      <Timeline />

      {/* PRINCIPLES MANIFESTO */}
      <section className="bg-ink text-cream relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-10" />
        <div className="aura-blob purple animate-aurora" style={{ width: 600, height: 600, top: "-10%", left: "10%", opacity: 0.3 }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 relative">
          <p className="eyebrow text-gold mb-6">The Code · Mamba Rules</p>
          <h2 className="font-serif text-5xl md:text-8xl leading-[0.92] max-w-5xl">
            Four rules. <span className="italic text-gold gold-glow">No exceptions.</span>
          </h2>
          <div className="mt-16 grid md:grid-cols-2 gap-px bg-cream/15">
            {PRINCIPLES.map((p) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="bg-ink p-8 md:p-12 group hover:bg-gradient-to-br hover:from-ink hover:to-purple/30 transition-all"
              >
                <p className="font-serif text-6xl text-gold/60 group-hover:text-gold transition-colors">{p.n}</p>
                <h3 className="font-serif text-3xl mt-4 italic">{p.t}</h3>
                <p className="text-sm text-cream/70 mt-3 leading-relaxed">{p.b}</p>
                {(p as any).whisper && (
                  <p className="mt-4 font-serif italic text-gold/90 text-base tracking-wide">
                    — {(p as any).whisper}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOURNAL */}
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

      {/* QUICK LINKS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-4xl md:text-6xl">The sections.</h2>
          <p className="eyebrow text-muted-foreground hidden md:block">Pick a chapter</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <FeatureCard to="/tournaments" eyebrow="On the court" title="Tournament reviews" body="Every game charted. Box scores, results, photo galleries, the bracket." />
          <FeatureCard to="/training" eyebrow="In the gym" title="Training log" body="Daily reps, weekly heat-map, and the streak that doesn't break." />
          <FeatureCard to="/college" eyebrow="The long game" title="College notebook" body="Ivy, Top 20, dream schools. Visits, deadlines, and the why behind each." />
          <FeatureCard to="/competitions" eyebrow="Stage-ready" title="Competitions" body="Showcases, AAU brackets, scholarships. The pipeline that gets you seen." />
          <FeatureCard to="/highlights" eyebrow="Wall of fame" title="Highlights" body="Quotes that hit. Mentions. The receipts of the rise." />
          <FeatureCard to="/journal" eyebrow="Mind & mindset" title="Journal" body="The notebook. Mood-tagged. Searchable. Honest." />
        </div>
      </section>

      {/* DREAM BOARD */}
      <section className="bg-gradient-to-b from-secondary/40 to-background relative overflow-hidden">
        <div className="aura-blob purple animate-aurora" style={{ width: 500, height: 500, top: "-10%", right: "-5%", opacity: 0.25 }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-purple mb-3">Manifesting · Out loud · On purpose</p>
              <h2 className="font-serif text-5xl md:text-7xl leading-[0.95]">
                The dream <span className="italic text-purple">board.</span>
              </h2>
            </div>
            <p className="lg:col-span-5 text-muted-foreground leading-relaxed">
              Loud goals. Specific dreams. The stuff I want so bad it's basically already mine. Receipts coming.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { tag: "School", goal: "Duke. Cameron Crazies. K Court." , vibe: "purple" },
              { tag: "On court", goal: "First in-game dunk", vibe: "gold" },
              { tag: "Read", goal: "Finish Atomic Habits → live it", vibe: "ink" },
              { tag: "Stage", goal: "National MVP — and mean it", vibe: "purple" },
              { tag: "Off court", goal: "Win pickleball doubles 🏓", vibe: "gold" },
              { tag: "Family", goal: "Make Nikash proud (he won't admit it)", vibe: "ink" },
              { tag: "Style", goal: "Custom No. 24 signature shoe", vibe: "purple" },
              { tag: "Travel", goal: "Practice at Staples. Touch the floor.", vibe: "gold" },
            ].map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.2 : -1.2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                className={`p-6 shadow-card border ${
                  d.vibe === "purple" ? "bg-purple text-cream border-purple" :
                  d.vibe === "gold" ? "bg-gold text-ink border-gold" :
                  "bg-ink text-cream border-ink"
                }`}
              >
                <p className="eyebrow opacity-70">{d.tag}</p>
                <p className="font-serif text-2xl mt-3 italic leading-tight">{d.goal}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-center eyebrow text-muted-foreground">
            ✦ Pinned above the desk · updated whenever the universe ships ✦
          </p>
        </div>
      </section>

      {/* LETTER TO FUTURE SELF */}
      <section className="bg-cream relative overflow-hidden">
        <div className="absolute inset-0 stripe-bg opacity-40" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-24 relative">
          <div className="text-center mb-10">
            <p className="eyebrow text-purple">Sealed · Open at graduation</p>
            <h2 className="font-serif text-5xl md:text-7xl mt-3 italic">Dear future Aanya,</h2>
          </div>
          <div className="bg-background border border-border shadow-elegant p-8 md:p-14 relative rotate-[-0.5deg]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-ink px-6 py-1 eyebrow shadow-card">
              ✦ from 9th grade Gobi ✦
            </div>
            <div className="font-serif text-xl md:text-2xl leading-[1.7] text-foreground/90 space-y-5 italic">
              <p>If you're reading this in a Duke hoodie, I knew it. If it's Harvard crimson — also goated. If it's neither, you better have a <span className="not-italic text-purple">very</span> good story.</p>
              <p>Did you ever dunk? Did you ever learn how to ride a bumpy kar? Is Nikash with you right now? (Be nice. Mostly.)</p>
              <p>Remember the timetables nobody asked us to make, the pickleball plans and tourneys. That girl built you. Don't forget her.</p>
              <p>The work is the reward. The Lakers will win another one. And you — you were always meant for the moment.</p>
              <p className="not-italic text-base md:text-lg text-purple/90 font-sans tracking-wide pt-2 border-t border-border/60">
                <span className="eyebrow text-purple">P.S.</span> &nbsp;If you forgot how loved you were at 14 — re-read this. Mom, Dad, and Nikash were already so proud. We always have been. 💜💛
              </p>
            </div>
            <div className="mt-10 flex items-end justify-between">
              <div>
                <img src={signature} alt="Gobi signature" loading="lazy" className="h-16 w-auto opacity-90" width={1024} height={512} />
                <p className="eyebrow text-purple mt-2">Aanya "Gobi" · age 14</p>
              </div>
              <p className="eyebrow text-muted-foreground hidden md:block">Class of 2030 · Birthday Edition</p>
            </div>
          </div>
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
            "Heroes come and go, <span className="italic text-gold gold-glow">but legends are forever.</span>"
          </h2>
          <p className="eyebrow text-cream/60 mt-8">— Kobe · taped above Aanya's desk, right next to the timetable</p>

          <div className="mt-16 max-w-md">
            <img src={signature} alt="Gobi signature" loading="lazy" className="h-20 w-auto invert opacity-90" width={1024} height={512} />
            <p className="eyebrow text-gold mt-2">Aanya "Gobi" · always working · 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div>
      <p className={`font-serif text-4xl tabular-nums ${accent ? "text-gold gold-glow" : "text-cream"}`}>{value}</p>
      <p className="eyebrow text-cream/60 mt-1">{label}</p>
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
      <p className="font-serif text-6xl mt-6 text-foreground tabular-nums">
        <CountUp to={value} />
      </p>
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
