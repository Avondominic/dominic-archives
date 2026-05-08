"use client";

type MotifKey =
  | "spiral" | "moon" | "hat" | "aura" | "rune"
  | "sun" | "orbit" | "fist" | "fruit" | "clock" | "mask";

type SilhouetteAnime = {
  slug: string;
  accent: string;
  accentSoft: string;
  motif?: MotifKey;
};

const SLUG_MOTIF: Record<string, MotifKey> = {
  naruto: "spiral",
  bleach: "moon",
  "one-piece": "hat",
  "dragon-ball-z": "aura",
  "jujutsu-kaisen": "rune",
  "demon-slayer": "sun",
  "blue-lock": "orbit",
  "one-punch-man": "fist",
  "death-note": "fruit",
  "tokyo-revengers": "clock",
  "spy-x-family": "mask",
};

export function SilhouetteArt({ anime }: { anime: SilhouetteAnime }) {
  const motif: MotifKey = anime.motif ?? SLUG_MOTIF[anime.slug] ?? "spiral";
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`g-${anime.slug}`} cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor={anime.accent} stopOpacity="0.45" />
          <stop offset="35%" stopColor={anime.accent} stopOpacity="0.18" />
          <stop offset="70%" stopColor="#0A0A0F" stopOpacity="1" />
          <stop offset="100%" stopColor="#06060A" stopOpacity="1" />
        </radialGradient>

        <linearGradient
          id={`v-${anime.slug}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#06060A" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#0A0A0F" stopOpacity="0" />
          <stop offset="100%" stopColor="#06060A" stopOpacity="0.95" />
        </linearGradient>

        <filter
          id={`blur-${anime.slug}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="40" />
        </filter>

        <filter id={`grain-${anime.slug}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
        </filter>
      </defs>

      {/* Radial atmospheric base */}
      <rect width="1920" height="1080" fill={`url(#g-${anime.slug})`} />

      {/* Soft accent halo behind motif */}
      <circle
        cx="960"
        cy="560"
        r="480"
        fill={anime.accent}
        opacity="0.16"
        filter={`url(#blur-${anime.slug})`}
      />

      {/* Motif silhouette */}
      <g transform="translate(960 560)" opacity="0.92">
        <Motif anime={anime} motif={motif} />
      </g>

      {/* Vignette + bottom darkening for text readability */}
      <rect width="1920" height="1080" fill={`url(#v-${anime.slug})`} />

      {/* Film grain */}
      <rect
        width="1920"
        height="1080"
        filter={`url(#grain-${anime.slug})`}
        opacity="0.5"
      />
    </svg>
  );
}

function Motif({ anime, motif }: { anime: SilhouetteAnime; motif: MotifKey }) {
  const a = anime.accent;
  const s = anime.accentSoft;
  const stroke = { stroke: s, strokeWidth: 2, fill: "none" as const };

  switch (motif) {
    case "spiral":
      return (
        <g>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              r={80 + i * 60}
              {...stroke}
              opacity={0.5 - i * 0.08}
            />
          ))}
          <path
            d="M 0 0 Q 120 -60 0 -180 Q -240 -300 0 -420"
            stroke={a}
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          <circle r="20" fill={a} />
        </g>
      );
    case "moon":
      return (
        <g>
          <circle r="240" fill={a} opacity="0.25" />
          <circle cx="80" r="240" fill="#0A0A0F" />
          <line x1="-360" y1="220" x2="360" y2="-220" stroke={s} strokeWidth="2" opacity="0.4" />
        </g>
      );
    case "hat":
      return (
        <g>
          <ellipse cx="0" cy="40" rx="280" ry="48" fill={a} opacity="0.6" />
          <path
            d="M -180 40 Q -180 -180 0 -180 Q 180 -180 180 40 Z"
            fill={a}
            opacity="0.45"
          />
          <rect x="-180" y="20" width="360" height="14" fill={s} opacity="0.5" />
        </g>
      );
    case "aura":
      return (
        <g>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * 120}
                y1={Math.sin(angle) * 120}
                x2={Math.cos(angle) * 360}
                y2={Math.sin(angle) * 360}
                stroke={a}
                strokeWidth="3"
                opacity="0.55"
              />
            );
          })}
          <circle r="100" fill={s} opacity="0.5" />
          <circle r="60" fill="#FFFBE6" opacity="0.7" />
        </g>
      );
    case "rune":
      return (
        <g>
          <polygon points="0,-260 220,130 -220,130" {...stroke} opacity="0.6" />
          <polygon
            points="0,260 220,-130 -220,-130"
            {...stroke}
            opacity="0.6"
          />
          <circle r="80" fill={a} opacity="0.35" />
          <circle r="200" {...stroke} opacity="0.3" />
        </g>
      );
    case "sun":
      return (
        <g>
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M 0 0 L ${Math.cos(angle - 0.05) * 380} ${Math.sin(angle - 0.05) * 380} L ${Math.cos(angle + 0.05) * 380} ${Math.sin(angle + 0.05) * 380} Z`}
                fill={a}
                opacity="0.18"
              />
            );
          })}
          <circle r="120" fill={a} opacity="0.55" />
        </g>
      );
    case "orbit":
      return (
        <g>
          <ellipse rx="320" ry="120" {...stroke} opacity="0.45" />
          <ellipse
            rx="320"
            ry="120"
            {...stroke}
            opacity="0.45"
            transform="rotate(60)"
          />
          <ellipse
            rx="320"
            ry="120"
            {...stroke}
            opacity="0.45"
            transform="rotate(-60)"
          />
          <circle r="60" fill={a} opacity="0.7" />
        </g>
      );
    case "fist":
      return (
        <g>
          <circle r="180" fill={a} opacity="0.55" />
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * 210}
                y1={Math.sin(angle) * 210}
                x2={Math.cos(angle) * 320}
                y2={Math.sin(angle) * 320}
                stroke={s}
                strokeWidth="6"
                opacity="0.6"
              />
            );
          })}
        </g>
      );
    case "fruit":
      return (
        <g>
          <path
            d="M -120 -40 Q -160 -240 0 -200 Q 160 -240 120 -40 Q 160 200 0 200 Q -160 200 -120 -40 Z"
            fill={a}
            opacity="0.7"
          />
          <path
            d="M 0 -200 Q 30 -260 80 -240"
            stroke={s}
            strokeWidth="6"
            fill="none"
          />
        </g>
      );
    case "clock":
      return (
        <g>
          <circle r="240" {...stroke} opacity="0.6" />
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * 220}
                y1={Math.sin(angle) * 220}
                x2={Math.cos(angle) * 240}
                y2={Math.sin(angle) * 240}
                stroke={s}
                strokeWidth="3"
              />
            );
          })}
          <line x1="0" y1="0" x2="0" y2="-160" stroke={a} strokeWidth="5" />
          <line x1="0" y1="0" x2="120" y2="0" stroke={a} strokeWidth="3" />
          <circle r="10" fill={a} />
        </g>
      );
    case "mask":
      return (
        <g>
          <ellipse rx="240" ry="160" fill={a} opacity="0.55" />
          <ellipse cx="-90" cy="-10" rx="50" ry="30" fill="#0A0A0F" />
          <ellipse cx="90" cy="-10" rx="50" ry="30" fill="#0A0A0F" />
          <line
            x1="-240"
            y1="0"
            x2="240"
            y2="0"
            stroke={s}
            strokeWidth="2"
            opacity="0.4"
          />
        </g>
      );
  }
}
