import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUOTES = [
  { t: "Heroes come and go, but legends are forever.", a: "Kobe Bryant" },
  { t: "Nothing is given. Everything is earned.", a: "LeBron James" },
  { t: "The work is the reward.", a: "Gobi · 2026" },
  { t: "I have nothing in common with lazy people who blame others for their lack of success.", a: "Kobe Bryant" },
  { t: "You have to be able to accept failure to get better.", a: "LeBron James" },
  { t: "Mamba mentality is about 4 a.m. workouts.", a: "Kobe Bryant" },
];

export function QuoteRotator({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[i];
  return (
    <div className={`relative h-24 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <p className="font-serif italic text-2xl md:text-3xl leading-snug">"{q.t}"</p>
          <p className="eyebrow text-gold mt-3">— {q.a}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
