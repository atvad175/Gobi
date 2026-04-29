import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/competitions")({
  component: CompetitionsPage,
  head: () => ({ meta: [{ title: "Competitions — Gobi" }, { name: "description", content: "Showcases, brackets, and scholarship competitions on the radar." }] }),
});

type Comp = {
  id: string; name: string; organizer: string | null; category: string | null;
  deadline: string | null; url: string | null; notes: string | null; status: string | null;
};

const STATUSES = ["interested", "applied", "qualified", "competing", "done"];

function CompetitionsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Comp[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("interested");

  const load = async () => {
    const { data } = await supabase.from("competitions").select("*").order("deadline", { ascending: true, nullsFirst: false });
    setItems((data as Comp[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("competitions").insert({
      user_id: user.id,
      name: f.get("name") as string,
      organizer: f.get("organizer") as string,
      category: f.get("category") as string,
      deadline: (f.get("deadline") as string) || null,
      url: f.get("url") as string,
      notes: f.get("notes") as string,
      status,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Added.");
    setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Remove?")) return;
    await supabase.from("competitions").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Stage-ready"
        title="Competitions."
        lead="Showcases, AAU brackets, scholarship programs, national camps. The pipeline that gets you seen."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> Add competition
          </button>
        )}

        {items.length === 0 ? (
          <EmptyState title="No competitions yet." hint="Find one. Sign up. Show up." isOwner={!!user} />
        ) : (
          <div className="space-y-px bg-border">
            {items.map((c) => (
              <article key={c.id} className="bg-background p-6 md:p-8 grid md:grid-cols-12 gap-4 md:items-center group hover:bg-card transition-colors">
                <div className="md:col-span-5">
                  <p className="eyebrow text-purple">{c.status}</p>
                  <h3 className="font-serif text-2xl mt-1">{c.name}</h3>
                  {c.organizer && <p className="text-xs text-muted-foreground mt-1">{c.organizer}</p>}
                </div>
                <div className="md:col-span-2 text-xs text-muted-foreground eyebrow">{c.category}</div>
                <div className="md:col-span-2 text-xs text-foreground eyebrow">
                  {c.deadline ? `Due ${c.deadline}` : "—"}
                </div>
                <div className="md:col-span-3 flex items-center justify-end gap-3">
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs text-purple hover:underline">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {user && (
                    <button onClick={() => del(c.id)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                {c.notes && <p className="md:col-span-12 text-sm text-muted-foreground italic font-serif border-t border-border/60 pt-4">"{c.notes}"</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Add a competition" onSubmit={submit} loading={saving}>
        <Field label="Name"><input name="name" required className={inputCls} placeholder="Adidas 3SSB Circuit" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Organizer"><input name="organizer" className={inputCls} /></Field>
          <Field label="Category"><input name="category" className={inputCls} placeholder="Showcase · AAU · Scholarship" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Deadline"><input name="deadline" type="date" className={inputCls} /></Field>
        </div>
        <Field label="URL"><input name="url" type="url" className={inputCls} placeholder="https://..." /></Field>
        <Field label="Notes"><textarea name="notes" className={textareaCls} /></Field>
      </OwnerForm>
    </div>
  );
}
