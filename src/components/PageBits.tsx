import { Link } from "@tanstack/react-router";

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
      <p className="eyebrow text-purple">{eyebrow}</p>
      <h1 className="font-serif text-5xl md:text-7xl mt-4 max-w-4xl leading-[0.95]">{title}</h1>
      <p className="mt-6 text-muted-foreground max-w-2xl leading-relaxed">{lead}</p>
      <div className="rule mt-10" />
    </header>
  );
}

export function EmptyState({ title, hint, isOwner }: { title: string; hint: string; isOwner: boolean }) {
  return (
    <div className="text-center py-20 border border-dashed border-border">
      <p className="font-serif italic text-3xl text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-3">{hint}</p>
      {!isOwner && (
        <Link to="/auth" className="inline-block mt-6 eyebrow text-purple hover:text-foreground">
          Sign in to add →
        </Link>
      )}
    </div>
  );
}

export function OwnerForm({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4 animate-float-up" onClick={() => onOpenChange(false)}>
      <div className="bg-background border border-border max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow text-purple">New entry</p>
        <h3 className="font-serif text-3xl mt-2">{title}</h3>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {children}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => onOpenChange(false)} className="flex-1 border border-border py-3 text-sm hover:bg-muted">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-foreground text-background py-3 text-sm hover:bg-purple disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full bg-transparent border-b border-border focus:border-purple outline-none py-2 font-serif text-lg";
export const textareaCls =
  "w-full bg-muted/50 border border-border focus:border-purple outline-none p-3 rounded-sm text-sm leading-relaxed min-h-[120px]";
