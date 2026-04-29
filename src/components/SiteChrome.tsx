import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu, X } from "lucide-react";
import { ScrollProgress } from "./ScrollProgress";

const links = [
  { to: "/", label: "Home" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/training", label: "Training" },
  { to: "/journal", label: "Journal" },
  { to: "/college", label: "College" },
  { to: "/competitions", label: "Competitions" },
  { to: "/highlights", label: "Highlights" },
];

export function SiteNav() {
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <>
      <ScrollProgress />
      <header className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-background/85 border-b border-border" : "bg-background/40"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-3xl leading-none tracking-tight italic">Gobi</span>
            <span className="eyebrow text-purple hidden sm:inline">No. 24</span>
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 text-sm tracking-wide transition-colors relative ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                  {active && <span className="absolute left-3 right-3 -bottom-px h-px bg-gold" />}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden md:inline-flex items-center gap-2 text-xs eyebrow text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            ) : (
              <Link to="/auth" className="hidden md:inline-flex text-xs eyebrow text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2 text-foreground"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-float-up">
            <nav className="px-6 py-6 flex flex-col gap-1">
              {links.map((l) => {
                const active = path === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`py-3 font-serif text-3xl ${active ? "text-purple italic" : "text-foreground"}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border">
                {user ? (
                  <button onClick={() => supabase.auth.signOut()} className="eyebrow text-muted-foreground inline-flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                ) : (
                  <Link to="/auth" className="eyebrow text-purple">Sign in →</Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="font-serif text-7xl italic">Gobi.</p>
            <p className="text-sm text-cream/70 mt-4 max-w-md leading-relaxed">
              Hooper. Student. Scholar in training. Built in the gym, sharpened in the library, born for the moment. Forever a Laker.
            </p>
            <p className="mt-8 eyebrow text-gold">Crafted with love · Birthday Edition · 2026</p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-gold mb-4">Explore</p>
            <ul className="space-y-2 text-sm text-cream/80">
              {links.map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow text-gold mb-4">North Stars</p>
            <p className="font-serif text-2xl">LeBron James</p>
            <p className="text-xs text-cream/60 mb-4">Relentlessness · Longevity · Leadership</p>
            <p className="font-serif text-2xl">Kobe Bryant</p>
            <p className="text-xs text-cream/60">Mamba Mentality · Detail · Hunger</p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-cream/15 flex flex-col md:flex-row justify-between gap-4 text-xs text-cream/50 eyebrow">
          <span>© 2026 Gobi · All rights reserved</span>
          <span>"Hard work beats talent when talent doesn't work hard."</span>
        </div>
      </div>
    </footer>
  );
}
