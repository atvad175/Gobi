import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2, Flame } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/training")({
  component: TrainingPage,
  head: () => ({
    meta: [
      { title: "Training Log — Gobi" },
      { name: "description", content: "Daily training log with weekly heat-map. Mamba reps, every day." },
    ],
  }),
});

type Log = { id: string; log_date: string; focus: string; duration_min: number | null; intensity: number | null; notes: string | null };

const FOCUS_OPTIONS = ["Shooting", "Ball-handling", "Strength", "Conditioning", "Film", "Footwork", "Recovery"];

function TrainingPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Log[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [focus, setFocus] = useState(FOCUS_OPTIONS[0]);
  const [intensity, setIntensity] = useState(3);

  const load = async () => {
    const { data } = await supabase.from("training_logs").select("*").order("log_date", { ascending: false });
    setItems((data as Log[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("training_logs").insert({
      user_id: user.id,
      log_date: (f.get("log_date") as string) || new Date().toISOString().slice(0, 10),
      focus,
      duration_min: Number(f.get("duration_min")) || null,
      intensity,
      notes: f.get("notes") as string,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Logged.");
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("training_logs").delete().eq("id", id);
    load();
  };

  // Build 12-week heatmap grid (84 days)
  const heatmap = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: string; intensity: number }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const log = items.find((l) => l.log_date === iso);
      days.push({ date: iso, intensity: log?.intensity ?? 0 });
    }
    return days;
  }, [items]);

  // Compute streak
  const streak = useMemo(() => {
    let s = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      if (items.some((l) => l.log_date === iso)) s++;
      else if (i > 0) break;
    }
    return s;
  }, [items]);

  const totalMin = items.reduce((acc, l) => acc + (l.duration_min ?? 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="In the gym"
        title="Training log."
        lead="Reps don't lie. Daily focus, weekly heat, monthly proof. The streak that doesn't break."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {/* Top stats */}
        <div className="grid grid-cols-3 gap-px bg-border mb-12">
          <div className="bg-background p-6">
            <p className="eyebrow text-muted-foreground">Current streak</p>
            <p className="font-serif text-5xl mt-2 flex items-center gap-2">
              {streak} <Flame className="h-6 w-6 text-gold" />
            </p>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </div>
          <div className="bg-background p-6">
            <p className="eyebrow text-muted-foreground">Total sessions</p>
            <p className="font-serif text-5xl mt-2">{items.length}</p>
          </div>
          <div className="bg-background p-6">
            <p className="eyebrow text-muted-foreground">Total minutes</p>
            <p className="font-serif text-5xl mt-2">{totalMin}</p>
            <p className="text-xs text-muted-foreground mt-1">{(totalMin / 60).toFixed(1)} hrs of work</p>
          </div>
        </div>

        {/* Heatmap */}
        <div className="border border-border p-6 mb-12 bg-card">
          <div className="flex items-end justify-between mb-4">
            <p className="eyebrow text-muted-foreground">Last 12 weeks</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>less</span>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`h-3 w-3 ${cellClass(i)}`} />
              ))}
              <span>more</span>
            </div>
          </div>
          <div className="grid grid-flow-col auto-cols-min gap-1" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
            {heatmap.map((d) => (
              <div
                key={d.date}
                title={`${d.date}${d.intensity ? ` · intensity ${d.intensity}` : ""}`}
                className={`h-3 w-3 ${cellClass(d.intensity)} hover:ring-1 hover:ring-foreground transition-all`}
              />
            ))}
          </div>
        </div>

        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> Log session
          </button>
        )}

        {items.length === 0 ? (
          <EmptyState title="No reps logged." hint="Day one starts now." isOwner={!!user} />
        ) : (
          <div className="space-y-px bg-border">
            {items.map((l) => (
              <article key={l.id} className="bg-background p-6 grid md:grid-cols-12 gap-4 md:items-center group">
                <div className="md:col-span-2">
                  <p className="font-serif text-3xl text-purple">{new Date(l.log_date).getDate()}</p>
                  <p className="eyebrow text-muted-foreground">{new Date(l.log_date).toLocaleString("en", { month: "short", year: "2-digit" })}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="eyebrow text-purple">{l.focus}</p>
                  <p className="font-serif text-xl mt-1">{l.duration_min ? `${l.duration_min} min` : "—"}</p>
                </div>
                <div className="md:col-span-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-2 w-6 ${i <= (l.intensity ?? 0) ? "bg-gold" : "bg-border"}`} />
                  ))}
                </div>
                <div className="md:col-span-4">
                  {l.notes && <p className="text-sm text-muted-foreground italic font-serif">"{l.notes}"</p>}
                </div>
                <div className="md:col-span-1 text-right">
                  {user && (
                    <button onClick={() => del(l.id)} className="text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Log a training session" onSubmit={submit} loading={saving}>
        <Field label="Date">
          <input name="log_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={inputCls} />
        </Field>
        <Field label="Focus">
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((f) => (
              <button type="button" key={f} onClick={() => setFocus(f)}
                className={`text-xs px-3 py-1.5 border ${focus === f ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration (min)"><input name="duration_min" type="number" className={inputCls} /></Field>
          <Field label="Intensity">
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button type="button" key={i} onClick={() => setIntensity(i)}
                  className={`h-3 flex-1 ${i <= intensity ? "bg-gold" : "bg-border"}`} />
              ))}
            </div>
          </Field>
        </div>
        <Field label="Notes"><textarea name="notes" className={textareaCls} placeholder="What did you work on? What broke through?" /></Field>
      </OwnerForm>
    </div>
  );
}

function cellClass(i: number) {
  if (i === 0) return "bg-border/50";
  if (i === 1) return "bg-purple/20";
  if (i === 2) return "bg-purple/40";
  if (i === 3) return "bg-purple/60";
  if (i === 4) return "bg-purple/80";
  return "bg-purple";
}
