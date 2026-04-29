import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/journal", label: "Journal" },
  { to: "/college", label: "College" },
  { to: "/competitions", label: "Competitions" },
];

export function SiteNav() {
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-3xl leading-none tracking-tight">Gobi</span>
          <span className="eyebrow text-muted-foreground hidden sm:inline">No. 24</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
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
                {active && (
                  <span className="absolute left-3 right-3 -bottom-px h-px bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-2 text-xs eyebrow text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-xs eyebrow text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-serif text-3xl">Gobi.</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Hooper. Student. Scholar in training. Forever a Laker.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="eyebrow text-foreground mb-3">North Stars</p>
          <p>LeBron James — relentlessness</p>
          <p>Kobe Bryant — Mamba mentality</p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p className="eyebrow text-foreground mb-3">2026 Season</p>
          <p>Crafted with love · Birthday edition</p>
        </div>
      </div>
    </footer>
  );
}
