import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

export function PhotoUpload({ tournamentId, userId, onUploaded }: { tournamentId: string; userId: string; onUploaded: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}/${tournamentId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("tournament-photos").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { error: insErr } = await supabase.from("tournament_photos").insert({
          tournament_id: tournamentId,
          user_id: userId,
          storage_path: path,
        });
        if (insErr) throw insErr;
      }
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded`);
      onUploaded();
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handle(e.target.files)} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 text-xs eyebrow border border-purple/40 px-4 py-2 hover:bg-purple hover:text-cream transition-colors disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {busy ? "Uploading…" : "Add photos"}
      </button>
    </>
  );
}

export function publicUrl(path: string) {
  return supabase.storage.from("tournament-photos").getPublicUrl(path).data.publicUrl;
}
