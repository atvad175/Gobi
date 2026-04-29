import { useEffect, useState } from "react";

export function CursorGlow({ tone = "gold" }: { tone?: "gold" | "purple" }) {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  const bg =
    tone === "purple"
      ? "radial-gradient(circle, color-mix(in oklab, var(--purple) 45%, transparent), transparent 60%)"
      : undefined;

  return (
    <div
      className="cursor-glow"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 0.9 : 0,
        ...(bg ? { background: bg } : {}),
      }}
      aria-hidden
    />
  );
}
