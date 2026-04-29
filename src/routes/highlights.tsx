import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { Plus, Trash2, Quote, ExternalLink, Newspaper, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/highlights")({
  component: HighlightsPage,
  head: () => ({
    meta: [
      { title: "Highlights — Gobi" },
      { name: "description", content: "Quotes, mentions, and moments worth keeping." },
    ],
  }),
});

type H = { id: string; kind: string; title: string; body: string | null; url: string | null; source: string | null; created_at: string };
const KINDS = ["quote", "press", "milestone"];

function HighlightsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<H[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [kind, setKind] = useState("quote");

  const load = async () => {
    const { data } = await supabase.from("highlights").select("*").order("created_at", { ascending: false });
    setItems((data as H[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("highlights").insert({
      user_id: user.id,
      kind,
      title: f.get("title") as string,
      body: f.get("body") as string,
      url: f.get("url") as string,
      source: f.get("source") as string,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Remove?")) return;
    await supabase.from("highlights").delete().eq("id", id);
    load();
  };

  const iconFor = (k: string) => k === "press" ? <Newspaper className="h-4 w-4" /> : k === "milestone" ? <Trophy className="h-4 w-4" /> : <Quote className="h-4 w-4" />;

  return (
    <div>
      <PageHeader
        eyebrow="Wall of fame"
        title="Highlights."
        lead="Quotes that hit. Press that landed. Milestones that mattered. The receipts of the rise."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {user && (
          <button onClick={() => setOpen(true)} className="mb-8 inline-flex items-center gap-2 text-sm bg-foreground text-background px-5 py-3 hover:bg-purple transition-colors">
            <Plus className="h-4 w-4" /> Add highlight
          </button>
        )}

        {items.length === 0 ? (
          <EmptyState title="The wall is fresh." hint="Pin the first one." isOwner={!!user} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((h, i) => {
              const isQuote = h.kind === "quote";
              const tilt = i % 3 === 0 ? "rotate-[-1deg]" : i % 3 === 1 ? "rotate-[0.5deg]" : "rotate-[1deg]";
              return (
                <article
                  key={h.id}
                  className={`relative p-8 group ${tilt} ${
                    isQuote ? "bg-ink text-cream" : "bg-card border border-border"
                  } hover:rotate-0 transition-all hover:shadow-elegant`}
                >
                  <div className={`flex items-center gap-2 eyebrow ${isQuote ? "text-gold" : "text-purple"}`}>
                    {iconFor(h.kind)} {h.kind}
                  </div>
                  {isQuote ? (
                    <p className="font-serif text-3xl italic mt-4 leading-tight">"{h.title}"</p>
                  ) : (
                    <h3 className="font-serif text-2xl mt-4">{h.title}</h3>
                  )}
                  {h.body && <p className={`mt-4 text-sm leading-relaxed ${isQuote ? "text-cream/80" : "text-muted-foreground"}`}>{h.body}</p>}
                  <div className="mt-6 flex items-center justify-between">
                    {h.source && <p className={`eyebrow text-xs ${isQuote ? "text-cream/60" : "text-muted-foreground"}`}>— {h.source}</p>}
                    {h.url && (
                      <a href={h.url} target="_blank" rel="noreferrer noopener" className={`text-xs eyebrow inline-flex items-center gap-1 ${isQuote ? "text-gold hover:text-cream" : "text-purple hover:text-foreground"}`}>
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {user && (
                    <button onClick={() => del(h.id)} className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 ${isQuote ? "text-cream/60 hover:text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Pin a highlight" onSubmit={submit} loading={saving}>
        <Field label="Type">
          <div className="flex gap-2">
            {KINDS.map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)}
                className={`text-xs px-3 py-1.5 border ${kind === k ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                {k}
              </button>
            ))}
          </div>
        </Field>
        <Field label={kind === "quote" ? "Quote" : "Title"}>
          <input name="title" required className={inputCls} placeholder={kind === "quote" ? "Hard work beats talent..." : "Featured in..."} />
        </Field>
        <Field label="Detail / context"><textarea name="body" className={textareaCls} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={kind === "quote" ? "Author" : "Source"}><input name="source" className={inputCls} placeholder="Kobe Bryant" /></Field>
          <Field label="URL (optional)"><input name="url" type="url" className={inputCls} placeholder="https://..." /></Field>
        </div>
      </OwnerForm>
    </div>
  );
}
