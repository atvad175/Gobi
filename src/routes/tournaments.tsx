import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tournaments")({
  component: TournamentsPage,
  head: () => ({ meta: [{ title: "Tournament Reviews — Gobi" }, { name: "description", content: "Game-by-game reviews from Gobi's basketball season." }] }),
});

type Tournament = {
  id: string; name: string; location: string | null; date: string | null; result: string | null;
  points: number | null; rebounds: number | null; assists: number | null; review: string | null;
};

function TournamentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Tournament[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("tournaments").select("*").order("date", { ascending: false, nullsFirst: false });
    setItems((data as Tournament[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const payload = {
      user_id: user.id,
      name: f.get("name") as string,
      location: f.get("location") as string,
      date: (f.get("date") as string) || null,
      result: f.get("result") as string,
      points: Number(f.get("points")) || null,
      rebounds: Number(f.get("rebounds")) || null,
      assists: Number(f.get("assists")) || null,
      review: f.get("review") as string,
    };
    const { error } = await supabase.from("tournaments").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tournament saved.");
    setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this tournament?")) return;
    await supabase.from("tournaments").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="On the court"
        title="Tournament reviews."
        lead="Every bracket, every box score, every lesson learned. The receipts."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> Log tournament
          </button>
        )}

        {items.length === 0 ? (
          <EmptyState title="No tournaments yet." hint="The next chapter starts on tip-off." isOwner={!!user} />
        ) : (
          <div className="space-y-px bg-border">
            {items.map((t) => (
              <article key={t.id} className="bg-background p-8 grid md:grid-cols-12 gap-6 group">
                <div className="md:col-span-5">
                  <h3 className="font-serif text-3xl">{t.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground eyebrow">
                    {t.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {t.location}</span>}
                    {t.date && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {t.date}</span>}
                    {t.result && <span className="text-purple">{t.result}</span>}
                  </div>
                </div>
                <div className="md:col-span-3 grid grid-cols-3 gap-4">
                  <Stat n={t.points} label="PTS" />
                  <Stat n={t.rebounds} label="REB" />
                  <Stat n={t.assists} label="AST" />
                </div>
                <div className="md:col-span-4">
                  {t.review && <p className="text-sm text-muted-foreground leading-relaxed italic font-serif">"{t.review}"</p>}
                  {user && (
                    <button onClick={() => del(t.id)} className="mt-4 text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" /> remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Log a tournament" onSubmit={submit} loading={saving}>
        <Field label="Name"><input name="name" required className={inputCls} placeholder="Spring Showcase 2026" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location"><input name="location" className={inputCls} /></Field>
          <Field label="Date"><input name="date" type="date" className={inputCls} /></Field>
        </div>
        <Field label="Result"><input name="result" className={inputCls} placeholder="W 62-48 · 1st place" /></Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Points"><input name="points" type="number" className={inputCls} /></Field>
          <Field label="Rebounds"><input name="rebounds" type="number" className={inputCls} /></Field>
          <Field label="Assists"><input name="assists" type="number" className={inputCls} /></Field>
        </div>
        <Field label="Review"><textarea name="review" className={textareaCls} placeholder="What worked, what didn't, what's next..." /></Field>
      </OwnerForm>
    </div>
  );
}

function Stat({ n, label }: { n: number | null; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl">{n ?? "—"}</p>
      <p className="eyebrow text-muted-foreground">{label}</p>
    </div>
  );
}
