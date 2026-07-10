import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import sneaker from "@/assets/card-sneaker.jpg";
import sunglasses from "@/assets/card-sunglasses.jpg";
import bag from "@/assets/card-bag.jpg";
import mountain from "@/assets/card-mountain.jpg";
import perfume from "@/assets/card-perfume.jpg";
import podium from "@/assets/podium-dark.png";

type Card = {
  id: number;
  src: string;
  label: string;
  badge?: string;
  cta?: string;
};

const initial: Card[] = [
  { id: 1, src: sneaker, label: "NEW COLLECTION", cta: "SHOP NOW" },
  { id: 2, src: mountain, label: "ESCAPE", cta: "EXPLORE" },
  { id: 3, src: sunglasses, label: "sofia.crea", badge: "LOVED" },
  { id: 4, src: perfume, label: "SIGNATURE", cta: "DISCOVER" },
  { id: 5, src: bag, label: "LIMITED TIME", badge: "20% OFF", cta: "BUY NOW" },
];

export function HeroCardStack() {
  const [cards, setCards] = useState<Card[]>(initial);

  useEffect(() => {
    const t = setInterval(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative mx-auto flex h-[520px] w-full max-w-[640px] items-center justify-center"
      style={{ perspective: "1500px" }}
    >
      {/* Glow pedestal */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 h-16 w-72 -translate-x-1/2 rounded-[50%] bg-primary/40 blur-3xl" />
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.35 0.15 285 / 0.9), transparent 70%)",
        }}
      />

      <div
        className="relative h-[240px] w-[340px] max-w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {cards.map((card, i) => {
          const offsetX = i * 28;
          const offsetY = i * -6;
          const scale = 1 - i * 0.05;
          const zIndex = cards.length - i;
          const blur = i === 0 ? 0 : i * 0.4;
          const thickness = 20;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", zIndex }}
              initial={false}
              animate={{
                x: offsetX,
                y: offsetY,
                scale,
                rotateY: -18,
                rotateX: 4,
                filter: `blur(${blur}px) brightness(${1 - i * 0.08})`,
                opacity: i > 4 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/50 to-black/20"
                  style={{ transform: `translateZ(-${thickness}px)` }}
                />

                {/* Left edge thickness */}
                <div
                  className="absolute left-0 top-0 rounded-l-sm bg-gradient-to-r from-black/70 to-black/30"
                  style={{
                    width: `${thickness}px`,
                    height: "100%",
                    transform: "translateX(-100%) rotateY(-90deg)",
                    transformOrigin: "right center",
                    backfaceVisibility: "hidden",
                  }}
                />
                {/* Bottom edge thickness */}
                <div
                  className="absolute bottom-0 left-0 rounded-b-sm bg-gradient-to-t from-black/70 to-black/30"
                  style={{
                    width: "100%",
                    height: `${thickness}px`,
                    transform: "translateY(100%) rotateX(90deg)",
                    transformOrigin: "top center",
                    backfaceVisibility: "hidden",
                  }}
                />

                {/* Front face */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 bg-card shadow-[var(--shadow-card)]"
                  style={{ transform: "translateZ(0)" }}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 bg-background/90 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                  </div>
                  <img
                    src={card.src}
                    alt={card.label}
                    className="h-[calc(100%-32px)] w-full object-cover"
                    draggable={false}
                  />
                  {/* Overlay content */}
                  <div className="absolute inset-x-0 top-10 flex flex-col gap-2 p-5">
                    <span className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/90 drop-shadow">
                      {card.label}
                    </span>
                    {card.cta && (
                      <button className="mt-1 w-fit rounded-full bg-foreground px-4 py-1.5 text-[10px] font-bold tracking-wider text-background shadow-lg">
                        {card.cta}
                      </button>
                    )}
                  </div>
                  {card.badge && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-bold tracking-wider text-background">
                      {card.badge}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}