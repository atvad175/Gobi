import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, EmptyState, OwnerForm, Field, inputCls, textareaCls } from "@/components/PageBits";
import { PhotoUpload, publicUrl } from "@/components/PhotoUpload";
import { Plus, Trash2, MapPin, Calendar, Star, X, Image as ImageIcon, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tournaments")({
  component: TournamentsPage,
  head: () => ({ meta: [{ title: "Tournament Pathway — Gobi" }, { name: "description", content: "Game-by-game pathway from district to nationals — with photo galleries." }] }),
});

type Tournament = {
  id: string; name: string; location: string | null; date: string | null; result: string | null;
  points: number | null; rebounds: number | null; assists: number | null; review: string | null;
  stage: string | null; tip_off: string | null; is_upcoming: boolean;
};

type Photo = {
  id: string; tournament_id: string; storage_path: string;
  caption: string | null; is_cover: boolean; is_mvp_moment: boolean;
};

const STAGES = [
  { key: "all", label: "All stops" },
  { key: "district", label: "District" },
  { key: "state", label: "State" },
  { key: "nationals", label: "Nationals" },
  { key: "showcase", label: "Showcase" },
];

const STAGE_DOT: Record<string, string> = {
  district: "bg-purple/70",
  state: "bg-purple",
  nationals: "bg-gold",
  showcase: "bg-cream border border-purple",
};

function TournamentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Tournament[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");
  const [view, setView] = useState<"bracket" | "gallery">("bracket");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const load = async () => {
    const [t, p] = await Promise.all([
      supabase.from("tournaments").select("*").order("date", { ascending: false, nullsFirst: false }),
      supabase.from("tournament_photos").select("*").order("created_at", { ascending: true }),
    ]);
    setItems((t.data as Tournament[]) ?? []);
    setPhotos((p.data as Photo[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const f = new FormData(e.target as HTMLFormElement);
    const tipOffStr = f.get("tip_off") as string;
    const payload = {
      user_id: user.id,
      name: f.get("name") as string,
      location: f.get("location") as string,
      date: (f.get("date") as string) || null,
      result: f.get("result") as string,
      stage: (f.get("stage") as string) || "district",
      tip_off: tipOffStr ? new Date(tipOffStr).toISOString() : null,
      is_upcoming: f.get("is_upcoming") === "on",
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
    if (!confirm("Delete this tournament and its photos?")) return;
    await supabase.from("tournaments").delete().eq("id", id);
    load();
  };

  const setMvp = async (photo: Photo) => {
    // Clear all MVPs, then set this one
    await supabase.from("tournament_photos").update({ is_mvp_moment: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tournament_photos").update({ is_mvp_moment: true }).eq("id", photo.id);
    toast.success("MVP moment set — featured on home.");
    load();
  };

  const setCover = async (photo: Photo) => {
    await supabase.from("tournament_photos").update({ is_cover: false }).eq("tournament_id", photo.tournament_id);
    await supabase.from("tournament_photos").update({ is_cover: true }).eq("id", photo.id);
    load();
  };

  const delPhoto = async (photo: Photo) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.storage.from("tournament-photos").remove([photo.storage_path]);
    await supabase.from("tournament_photos").delete().eq("id", photo.id);
    load();
  };

  const filtered = stageFilter === "all" ? items : items.filter((x) => (x.stage ?? "district") === stageFilter);
  const photosByT = new Map<string, Photo[]>();
  photos.forEach((p) => {
    const arr = photosByT.get(p.tournament_id) ?? [];
    arr.push(p);
    photosByT.set(p.tournament_id, arr);
  });

  const games = items.filter((t) => !t.is_upcoming).length;
  const sum = (k: "points" | "rebounds" | "assists") =>
    items.filter((t) => !t.is_upcoming).reduce((acc, x) => acc + (x[k] ?? 0), 0);
  const ppg = games ? +(sum("points") / games).toFixed(1) : 0;
  const rpg = games ? +(sum("rebounds") / games).toFixed(1) : 0;
  const apg = games ? +(sum("assists") / games).toFixed(1) : 0;
  const wins = items.filter((t) => (t.result ?? "").toLowerCase().startsWith("w")).length;

  return (
    <div>
      <PageHeader
        eyebrow="On the court"
        title="The pathway."
        lead="District → State → Nationals → Showcase. Every bracket, every box score, every photo. The road to the next level."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        {games > 0 && (
          <div className="mb-12 grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border">
            <SeasonStat label="Games" v={games} />
            <SeasonStat label="W–L" v={`${wins}-${games - wins}`} />
            <SeasonStat label="PPG" v={ppg} accent />
            <SeasonStat label="RPG" v={rpg} accent />
            <SeasonStat label="APG" v={apg} accent />
          </div>
        )}

        {/* Controls */}
        <div className="mb-10 flex flex-wrap items-center gap-4 justify-between border-b border-border pb-6">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStageFilter(s.key)}
                className={`text-xs eyebrow px-4 py-2 transition-colors ${
                  stageFilter === s.key ? "bg-foreground text-background" : "border border-border hover:border-purple"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setView("bracket")}
              className={`text-xs eyebrow px-4 py-2 transition-colors ${view === "bracket" ? "bg-purple text-cream" : "border border-border hover:border-purple"}`}
            >
              Bracket
            </button>
            <button
              onClick={() => setView("gallery")}
              className={`text-xs eyebrow px-4 py-2 transition-colors ${view === "gallery" ? "bg-purple text-cream" : "border border-border hover:border-purple"}`}
            >
              Gallery
            </button>
            {user && (
              <button onClick={() => setOpen(true)} className="ml-2 inline-flex items-center gap-2 text-xs eyebrow bg-foreground text-background px-4 py-2 hover:bg-purple transition-colors">
                <Plus className="h-3.5 w-3.5" /> Log
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No tournaments yet." hint="The next chapter starts on tip-off." isOwner={!!user} />
        ) : view === "bracket" ? (
          <BracketView items={filtered} photos={photosByT} user={user} onDel={del} onPhotoUploaded={load} onSetMvp={setMvp} onSetCover={setCover} onDelPhoto={delPhoto} onLightbox={setLightbox} />
        ) : (
          <GalleryView items={filtered} photos={photosByT} onLightbox={setLightbox} />
        )}
      </section>

      <OwnerForm open={open} onOpenChange={setOpen} title="Log a tournament" onSubmit={submit} loading={saving}>
        <Field label="Name"><input name="name" required className={inputCls} placeholder="Spring Showcase 2026" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location"><input name="location" className={inputCls} /></Field>
          <Field label="Date played"><input name="date" type="date" className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage">
            <select name="stage" className={inputCls} defaultValue="district">
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="nationals">Nationals</option>
              <option value="showcase">Showcase</option>
            </select>
          </Field>
          <Field label="Tip-off (for countdown)"><input name="tip_off" type="datetime-local" className={inputCls} /></Field>
        </div>
        <Field label="Result"><input name="result" className={inputCls} placeholder="W 62-48 · 1st place" /></Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Points"><input name="points" type="number" className={inputCls} /></Field>
          <Field label="Rebounds"><input name="rebounds" type="number" className={inputCls} /></Field>
          <Field label="Assists"><input name="assists" type="number" className={inputCls} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_upcoming" />
          <span>This is an upcoming game (don't count in stats)</span>
        </label>
        <Field label="Review"><textarea name="review" className={textareaCls} placeholder="What worked, what didn't, what's next..." /></Field>
      </OwnerForm>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/95 z-50 grid place-items-center p-4 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-cream hover:text-gold" onClick={() => setLightbox(null)}>
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              src={publicUrl(lightbox.storage_path)} alt={lightbox.caption ?? ""}
              className="max-h-[90vh] max-w-full object-contain shadow-elegant"
            />
            {lightbox.caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif italic text-cream text-xl text-center max-w-2xl">"{lightbox.caption}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BracketView({
  items, photos, user, onDel, onPhotoUploaded, onSetMvp, onSetCover, onDelPhoto, onLightbox,
}: {
  items: Tournament[]; photos: Map<string, Photo[]>; user: any;
  onDel: (id: string) => void; onPhotoUploaded: () => void;
  onSetMvp: (p: Photo) => void; onSetCover: (p: Photo) => void; onDelPhoto: (p: Photo) => void;
  onLightbox: (p: Photo) => void;
}) {
  return (
    <div className="space-y-8">
      {items.map((t, idx) => {
        const ps = photos.get(t.id) ?? [];
        const win = (t.result ?? "").toLowerCase().startsWith("w");
        const stage = t.stage ?? "district";
        return (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group border border-border bg-card hover:border-purple/60 transition-colors overflow-hidden"
          >
            <div className="grid lg:grid-cols-12 gap-0">
              {/* Left rail — stage marker */}
              <div className="lg:col-span-1 bg-ink text-cream p-6 flex lg:flex-col items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${STAGE_DOT[stage]}`} />
                  <span className="eyebrow text-cream/70 text-[0.6rem] [writing-mode:vertical-rl] hidden lg:inline">{stage}</span>
                </div>
                <span className="font-serif text-3xl text-gold">{String(idx + 1).padStart(2, "0")}</span>
              </div>

              <div className="lg:col-span-11 p-8 grid md:grid-cols-12 gap-6">
                <div className="md:col-span-5">
                  {t.is_upcoming && (
                    <span className="inline-block bg-gold text-gold-foreground eyebrow text-[0.6rem] px-2 py-1 mb-2">Upcoming</span>
                  )}
                  <h3 className="font-serif text-3xl">{t.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground eyebrow">
                    {t.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {t.location}</span>}
                    {t.date && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {t.date}</span>}
                    {t.result && <span className={win ? "text-purple font-semibold" : ""}>{t.result}</span>}
                  </div>
                  {t.review && <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic font-serif">"{t.review}"</p>}
                </div>

                <div className="md:col-span-3 grid grid-cols-3 gap-4">
                  <Stat n={t.points} label="PTS" />
                  <Stat n={t.rebounds} label="REB" />
                  <Stat n={t.assists} label="AST" />
                </div>

                {/* Photos */}
                <div className="md:col-span-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="eyebrow text-purple flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Gallery ({ps.length})</p>
                    {user && <PhotoUpload tournamentId={t.id} userId={user.id} onUploaded={onPhotoUploaded} />}
                  </div>
                  {ps.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No photos yet</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      {ps.slice(0, 6).map((p) => (
                        <div key={p.id} className="relative aspect-square overflow-hidden bg-muted group/photo">
                          <img
                            src={publicUrl(p.storage_path)} alt={p.caption ?? ""}
                            className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => onLightbox(p)}
                            loading="lazy"
                          />
                          {p.is_mvp_moment && (
                            <div className="absolute top-1 left-1 bg-gold text-gold-foreground p-1" title="MVP moment">
                              <Zap className="h-3 w-3" />
                            </div>
                          )}
                          {p.is_cover && !p.is_mvp_moment && (
                            <div className="absolute top-1 left-1 bg-purple text-cream p-1" title="Cover">
                              <Star className="h-3 w-3" />
                            </div>
                          )}
                          {user && (
                            <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button onClick={(e) => { e.stopPropagation(); onSetMvp(p); }} className="text-cream hover:text-gold p-1" title="Set MVP">
                                <Zap className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onSetCover(p); }} className="text-cream hover:text-gold p-1" title="Set cover">
                                <Star className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onDelPhoto(p); }} className="text-cream hover:text-destructive p-1" title="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {user && (
                    <button onClick={() => onDel(t.id)} className="mt-4 text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> remove tournament
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function GalleryView({ items, photos, onLightbox }: { items: Tournament[]; photos: Map<string, Photo[]>; onLightbox: (p: Photo) => void }) {
  const all = items.flatMap((t) => (photos.get(t.id) ?? []).map((p) => ({ p, t })));
  if (all.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border">
        <Trophy className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <p className="font-serif italic text-2xl text-muted-foreground">No photos uploaded yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Add some from the bracket view to start the wall.</p>
      </div>
    );
  }
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
      {all.map(({ p, t }) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="break-inside-avoid mb-3 relative group cursor-pointer"
          onClick={() => onLightbox(p)}
        >
          <img src={publicUrl(p.storage_path)} alt={p.caption ?? t.name} className="w-full" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div>
              <p className="eyebrow text-gold text-[0.65rem]">{t.stage ?? "district"}</p>
              <p className="font-serif text-cream text-lg italic">{t.name}</p>
            </div>
          </div>
          {p.is_mvp_moment && (
            <div className="absolute top-2 left-2 bg-gold text-gold-foreground eyebrow text-[0.6rem] px-2 py-1 flex items-center gap-1">
              <Zap className="h-3 w-3" /> MVP
            </div>
          )}
        </motion.div>
      ))}
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

function SeasonStat({ label, v, accent }: { label: string; v: number | string; accent?: boolean }) {
  return (
    <div className="bg-background p-6">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className={`font-serif text-5xl mt-2 ${accent ? "text-purple" : ""}`}>{v}</p>
    </div>
  );
}
