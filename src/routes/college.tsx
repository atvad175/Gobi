import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/college")({
  component: CollegePage,
  head: () => ({ meta: [{ title: "College Notebook — Gobi" }, { name: "description", content: "Ivy League and Top 20 — the road to college." }] }),
});

type Note = {
  id: string; school: string; category: string | null; notes: string | null;
  deadline: string | null; status: string | null; priority: number | null;
};

const STATUSES = ["researching", "applied", "visited", "shortlist", "dream"];
const SEED_SCHOOLS = ["Harvard", "Yale", "Princeton", "Stanford", "Duke", "UCLA", "Columbia", "Brown"];

function CollegePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("researching");
  const [priority, setPriority] = useState(3);

  const load = async () => {
    const { data } = await supabase.from("college_notes").select("*").order("priority", { ascending: false });
    setItems((data as Note[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("college_notes").insert({
      user_id: user.id,
      school: f.get("school") as string,
      category: f.get("category") as string,
      notes: f.get("notes") as string,
      deadline: (f.get("deadline") as string) || null,
      status, priority,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Added.");
    setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Remove school?")) return;
    await supabase.from("college_notes").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="The long game"
        title="College notebook."
        lead="Ivy League. Top 20. Dream big, plan precise. The schools, the deadlines, the why behind each one."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex flex-wrap gap-2 mb-8">
          {SEED_SCHOOLS.map((s) => (
            <span key={s} className="text-xs eyebrow border border-border px-3 py-1.5 text-muted-foreground">{s}</span>
          ))}
        </div>

        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> Add school
          </button>
        )}

        {items.length === 0 ? (
          <EmptyState title="The notebook is fresh." hint="Start with the dream school." isOwner={!!user} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((n) => (
              <article key={n.id} className="border border-border p-6 bg-card group hover:border-purple transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow text-purple">{n.status}</p>
                    <h3 className="font-serif text-3xl mt-1">{n.school}</h3>
                    {n.category && <p className="text-xs text-muted-foreground mt-1">{n.category}</p>}
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < (n.priority ?? 0) ? "fill-gold text-gold" : "text-border"}`} />
                    ))}
                  </div>
                </div>
                {n.deadline && <p className="text-xs text-muted-foreground mt-3 eyebrow">Deadline · {n.deadline}</p>}
                {n.notes && <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{n.notes}</p>}
                {user && (
                  <button onClick={() => del(n.id)} className="mt-4 text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" /> remove
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Add a school" onSubmit={submit} loading={saving}>
        <Field label="School"><input name="school" required className={inputCls} placeholder="Princeton" /></Field>
        <Field label="Category"><input name="category" className={inputCls} placeholder="Ivy · D1 · Engineering" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Deadline"><input name="deadline" type="date" className={inputCls} /></Field>
        </div>
        <Field label="Priority">
          <div className="flex gap-1 mt-1">
            {[1,2,3,4,5].map((p) => (
              <button type="button" key={p} onClick={() => setPriority(p)}>
                <Star className={`h-6 w-6 ${p <= priority ? "fill-gold text-gold" : "text-border"}`} />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Notes"><textarea name="notes" className={textareaCls} placeholder="What they want, who to talk to, what to highlight..." /></Field>
      </OwnerForm>
    </div>
  );
}
