"use client";

/**
 * Decorative isometric credit cards for the get-started / landing hero.
 * Matches the reference: floating cards with varied finishes (matte, gradient, metallic)
 * and a clean, modern layout with soft shadows.
 */

const CARD_STYLES = [
  {
    id: "dark",
    className:
      "bg-gradient-to-b from-[#2a2d32] to-[#1c1e22] shadow-lg shadow-black/30",
    style: { transform: "rotateY(-12deg) rotateX(8deg) translateZ(0)" } as React.CSSProperties,
    position: "top-2 right-[5%] sm:top-4 sm:right-[8%]",
    chip: "bg-amber-600/80",
    text: "text-white",
    hideBelowSm: false,
    motion: "hero-card-run-a 4.8s ease-in-out infinite",
  },
  {
    id: "white",
    className: "bg-white shadow-lg shadow-black/20",
    style: { transform: "rotateY(10deg) rotateX(-6deg) translateZ(0)" } as React.CSSProperties,
    position: "top-4 left-[8%] sm:top-8 sm:left-[12%]",
    chip: "bg-amber-500/90",
    text: "text-black",
    hideBelowSm: false,
    motion: "hero-card-run-b 4.4s ease-in-out infinite -0.6s",
  },
  {
    id: "gradient-pink-cyan",
    className:
      "shadow-xl shadow-pink-900/20 bg-gradient-to-br from-pink-400 via-pink-300 to-cyan-300",
    style: { transform: "rotateY(-5deg) rotateX(4deg) translateZ(0)" } as React.CSSProperties,
    position: "top-1/2 left-[2%] -translate-y-1/2 sm:left-[6%]",
    chip: "bg-amber-600/90",
    text: "text-black",
    hideBelowSm: true,
    motion: "hero-card-run-c 5.1s ease-in-out infinite -1.1s",
  },
  {
    id: "gradient-blue-magenta",
    className:
      "shadow-xl shadow-indigo-900/30 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600",
    style: { transform: "rotateY(8deg) rotateX(-5deg) translateZ(0)" } as React.CSSProperties,
    position: "top-1/2 right-[4%] -translate-y-1/2 sm:right-[10%]",
    chip: "bg-white/20",
    text: "text-white",
    hideBelowSm: true,
    motion: "hero-card-run-d 4.9s ease-in-out infinite -1.7s",
  },
  {
    id: "bronze",
    className:
      "shadow-lg shadow-amber-900/25 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,#c9a227,#8b6914)]",
    style: {
      transform: "rotateY(-18deg) rotateX(6deg) translateZ(0)",
      boxShadow: "inset 0 0 60px rgba(0,0,0,0.15)",
    },
    position: "bottom-[24%] left-[10%] sm:bottom-[28%] sm:left-[18%]",
    chip: "bg-white/25",
    text: "text-white",
    hideBelowSm: true,
    motion: "hero-card-run-e 5.2s ease-in-out infinite -2.1s",
  },
  {
    id: "silver",
    className:
      "shadow-lg shadow-slate-800/30 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,#e8e8e8,#9ca3af)]",
    style: {
      transform: "rotateY(14deg) rotateX(-4deg) translateZ(0)",
      boxShadow: "inset 0 0 50px rgba(255,255,255,0.2)",
    },
    position: "bottom-[22%] right-[8%] sm:bottom-[26%] sm:right-[14%]",
    chip: "bg-slate-700/60",
    text: "text-slate-900",
    hideBelowSm: true,
    motion: "hero-card-run-f 4.6s ease-in-out infinite -2.5s",
  },
] as const;

function CardBack({
  className,
  chipClassName,
  textClassName,
  style,
}: {
  className: string;
  chipClassName: string;
  textClassName: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute w-[140px] h-[88px] sm:w-[160px] sm:h-[100px] rounded-xl overflow-hidden border border-white/10 ${className}`}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div
            className={`w-6 h-5 rounded-sm ${chipClassName}`}
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }}
          />
          <div className="flex items-center gap-1">
            <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest ${textClassName} opacity-90`}>
              VISA
            </span>
            <svg
              className="w-4 h-4 opacity-80"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        </div>
        <div className={`text-[10px] sm:text-xs font-medium tracking-wider ${textClassName} opacity-90`}>
          **** **** **** 8822
        </div>
        <div className={`text-[9px] sm:text-[10px] ${textClassName} opacity-80`}>
          LEONARDO DE LUCA
        </div>
      </div>
    </div>
  );
}

export function HeroCards() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      <div className="absolute inset-0 [perspective:1200px]">
        {CARD_STYLES.map((card) => (
          <div
            key={card.id}
            className={`absolute ${card.position} transition-transform duration-300 hover:scale-105 ${card.hideBelowSm ? "hidden sm:block" : ""}`}
            style={{ transformStyle: "preserve-3d", animation: card.motion }}
          >
            <CardBack
              className={card.className}
              chipClassName={card.chip}
              textClassName={card.text}
              style={card.style}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
