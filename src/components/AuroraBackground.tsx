export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="aura-blob purple animate-aurora" style={{ width: 720, height: 720, top: "-15%", left: "-10%" }} />
      <div className="aura-blob gold animate-aurora-2" style={{ width: 600, height: 600, top: "20%", right: "-15%" }} />
      <div className="aura-blob violet animate-aurora" style={{ width: 540, height: 540, bottom: "-20%", left: "30%", animationDelay: "-8s" }} />
      <div className="absolute inset-0 court-grid opacity-60" />
    </div>
  );
}
