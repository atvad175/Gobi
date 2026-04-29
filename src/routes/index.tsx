import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/gobi-hero.jpg";
import courtImg from "@/assets/court.jpg";
import { ArrowUpRight, Trophy, BookOpen, GraduationCap, Award } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const NORTH_STARS = [
  { name: "LeBron", trait: "Relentlessness" },
  { name: "Kobe", trait: "Mamba Mentality" },
  { name: "Lakers", trait: "Forever Purple & Gold" },
];

function Home() {
  const [counts, setCounts] = useState({ tournaments: 0, journal: 0, college: 0, comps: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("tournaments").select("*", { count: "exact", head: true }),
      supabase.from("journal_entries").select("*", { count: "exact", head: true }),
      supabase.from("college_notes").select("*", { count: "exact", head: true }),
      supabase.from("competitions").select("*", { count: "exact", head: true }),
    ]).then(([t, j, c, cm]) => {
      setCounts({
        tournaments: t.count ?? 0,
        journal: j.count ?? 0,
        college: c.count ?? 0,
        comps: cm.count ?? 0,
      });
    });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 animate-float-up">
            <p className="eyebrow text-purple mb-6">No. 24 · Class of 2029 · Guard</p>
            <h1 className="display font-serif text-[clamp(3.5rem,11vw,9rem)] text-foreground">
              Gobi.
              <br />
              <span className="italic text-purple">Built for</span>
              <br />
              <span className="text-foreground">the moment.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              National-level basketball player. 9th-grade scholar. Future Ivy.
              This is the notebook, the highlight reel, and the long game — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/tournaments"
                className="group inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 text-sm tracking-wide hover:bg-purple transition-colors"
              >
                See the season
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                to="/journal"
                className="inline-flex items-center gap-3 border border-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-foreground transition-colors"
              >
                Read the journal
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-float-up" style={{ animationDelay: "150ms" }}>
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img
                src={heroImg}
                alt="Gobi in her Lakers jersey holding a basketball"
                className="absolute inset-0 w-full h-full object-cover"
                width={1080}
                height={1350}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink/90 to-transparent">
                <p className="eyebrow text-gold">Cover Athlete · 2026</p>
                <p className="font-serif text-cream text-2xl mt-1 italic">"The work is the reward."</p>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-gold text-gold-foreground px-4 py-2 eyebrow shadow-card hidden md:block">
              Birthday Edition
            </div>
          </div>
        </div>
      </section>

      <div className="rule max-w-7xl mx-auto" />

      {/* STATS GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-muted-foreground mb-2">The Tale of the Tape</p>
            <h2 className="font-serif text-4xl md:text-5xl">By the numbers.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Tournaments" value={counts.tournaments} to="/tournaments" />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Journal Entries" value={counts.journal} to="/journal" />
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Schools Tracked" value={counts.college} to="/college" />
          <StatCard icon={<Award className="h-5 w-5" />} label="Competitions" value={counts.comps} to="/competitions" />
        </div>
      </section>

      {/* QUICK LINKS GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <FeatureCard
            to="/tournaments"
            eyebrow="On the court"
            title="Tournament reviews"
            body="Every game, charted. Points, rebounds, assists — and the story behind them."
          />
          <FeatureCard
            to="/college"
            eyebrow="The long game"
            title="College notebook"
            body="Ivy, Top 20, dream schools. Visits, deadlines, and what each one wants to see."
          />
          <FeatureCard
            to="/competitions"
            eyebrow="Stage-ready"
            title="Competitions to enter"
            body="Showcases, AAU brackets, scholarship programs. The pipeline."
          />
        </div>
      </section>

      {/* NORTH STARS */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={courtImg} alt="" loading="lazy" className="w-full h-full object-cover opacity-30" width={1600} height={900} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 text-cream">
          <p className="eyebrow text-gold mb-6">North Stars</p>
          <h2 className="font-serif text-4xl md:text-6xl max-w-3xl leading-tight">
            Every great player <span className="italic text-gold">studies the greats.</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-px bg-cream/15 max-w-3xl">
            {NORTH_STARS.map((s) => (
              <div key={s.name} className="bg-ink p-6">
                <p className="font-serif text-3xl">{s.name}</p>
                <p className="eyebrow text-gold mt-2">{s.trait}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, to }: { icon: React.ReactNode; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="bg-background p-8 hover:bg-card transition-colors group">
      <div className="flex items-center justify-between text-muted-foreground">
        {icon}
        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-serif text-6xl mt-6 text-foreground">{value.toString().padStart(2, "0")}</p>
      <p className="eyebrow text-muted-foreground mt-2">{label}</p>
    </Link>
  );
}

function FeatureCard({ to, eyebrow, title, body }: { to: string; eyebrow: string; title: string; body: string }) {
  return (
    <Link to={to} className="group block border border-border bg-card p-8 hover:border-purple transition-colors">
      <p className="eyebrow text-purple">{eyebrow}</p>
      <h3 className="font-serif text-3xl mt-4 group-hover:italic transition-all">{title}</h3>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{body}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm">
        Open <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Link>
  );
}
