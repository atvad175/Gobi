import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/journal")({
  component: JournalPage,
  head: () => ({ meta: [{ title: "Journal — Gobi" }, { name: "description", content: "Daily journal — thoughts, training, mindset." }] }),
});

type Entry = { id: string; title: string; body: string | null; mood: string | null; entry_date: string };

const MOODS = ["🔥 locked-in", "💪 grinding", "😌 grateful", "😤 frustrated", "🌙 reflecting", "🎯 focused"];

function JournalPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mood, setMood] = useState(MOODS[0]);

  const load = async () => {
    const { data } = await supabase.from("journal_entries").select("*").order("entry_date", { ascending: false });
    setItems((data as Entry[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: f.get("title") as string,
      body: f.get("body") as string,
      mood,
      entry_date: (f.get("entry_date") as string) || new Date().toISOString().slice(0, 10),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete entry?")) return;
    await supabase.from("journal_entries").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="The notebook"
        title="Journal."
        lead="Mind sharper than the body. Reflections from the road, the gym, and everywhere in between."
      />
      <section className="max-w-4xl mx-auto px-6 lg:px-10 pb-20">
        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> New entry
          </button>
        )}
        {items.length === 0 ? (
          <EmptyState title="The page is blank." hint="Pick up the pen." isOwner={!!user} />
        ) : (
          <div className="space-y-12">
            {items.map((e, i) => (
              <article key={e.id} className="grid grid-cols-[auto_1fr] gap-8 group">
                <div className="text-right">
                  <p className="font-serif text-5xl text-purple leading-none">{new Date(e.entry_date).getDate()}</p>
                  <p className="eyebrow text-muted-foreground mt-1">{new Date(e.entry_date).toLocaleString("en", { month: "short" })}</p>
                  <p className="text-xs text-muted-foreground">{new Date(e.entry_date).getFullYear()}</p>
                </div>
                <div className="border-l border-border pl-8 pb-8">
                  {e.mood && <p className="text-sm mb-3">{e.mood}</p>}
                  <h3 className="font-serif text-3xl italic">{e.title}</h3>
                  {e.body && <p className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">{e.body}</p>}
                  {user && (
                    <button onClick={() => del(e.id)} className="mt-4 text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" /> remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="New journal entry" onSubmit={submit} loading={saving}>
        <Field label="Date"><input name="entry_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={inputCls} /></Field>
        <Field label="Title"><input name="title" required className={inputCls} placeholder="Practice felt different today..." /></Field>
        <Field label="Mood">
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button type="button" key={m} onClick={() => setMood(m)} className={`text-xs px-3 py-1.5 border ${mood === m ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>{m}</button>
            ))}
          </div>
        </Field>
        <Field label="Body"><textarea name="body" className={textareaCls} placeholder="Write freely..." /></Field>
      </OwnerForm>
    </div>
  );
}
