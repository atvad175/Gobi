import { useEffect, useState } from "react";

export function NextGameCountdown({ tipOff, name }: { tipOff: string; name: string }) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(tipOff).getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft({ d, h, m, s });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [tipOff]);

  return (
    <div className="glass-dark text-cream px-6 py-5 inline-flex flex-col gap-2 shadow-elegant">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gold animate-pulse-ring" />
        <p className="eyebrow text-gold">Next tip-off · {name}</p>
      </div>
      <div className="flex gap-4 font-serif">
        <Unit n={left.d} l="days" />
        <Unit n={left.h} l="hrs" />
        <Unit n={left.m} l="min" />
        <Unit n={left.s} l="sec" />
      </div>
    </div>
  );
}

function Unit({ n, l }: { n: number; l: string }) {
  return (
    <div className="text-center min-w-[3.5rem]">
      <p className="text-3xl tabular-nums">{String(n).padStart(2, "0")}</p>
      <p className="eyebrow text-cream/60 text-[0.6rem]">{l}</p>
    </div>
  );
}
