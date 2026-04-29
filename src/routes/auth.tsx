import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — Gobi" }] }),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: "Gobi" } },
        });
        if (error) throw error;
        toast.success("Welcome, Gobi. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Back on the court.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-6">
      <div className="w-full max-w-md">
        <p className="eyebrow text-purple text-center">Owner Access</p>
        <h1 className="font-serif text-5xl text-center mt-3">{mode === "signin" ? "Welcome back." : "Set up your space."}</h1>
        <p className="text-center text-muted-foreground mt-3 text-sm">
          Sign in to add tournaments, journal entries, and college notes. Visitors can read everything without an account.
        </p>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <div>
            <label className="eyebrow text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-purple outline-none py-3 text-lg font-serif"
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-purple outline-none py-3 text-lg font-serif"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-4 mt-6 hover:bg-purple transition-colors text-sm tracking-wide disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "First time here? Create account →" : "Already have an account? Sign in →"}
        </button>
      </div>
    </div>
  );
}
