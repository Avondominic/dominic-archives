"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Anime } from "@/data/anime";

/* ─── constants ─────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];
const VILLAIN_ACCENT = "#C0392B";

/* ─── helpers ────────────────────────────────────────────────────────────────── */

function hex(color: string, alpha: number) {
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Split synopsis string into individual sentences. */
function parseSentences(text: string): string[] {
  return (
    text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

/* ─── kinetic letter-by-letter title ─────────────────────────────────────────── */

const letterVariants: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.75,
      delay: 0.2 + i * 0.042,
      ease: EASE_SHARP,
    },
  }),
};

function KineticTitle({
  text,
  accent,
  className,
}: {
  text: string;
  accent: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const chars = text.split("");
  const goldenStart = Math.floor(chars.length * 0.6);
  const accentStyle = (i: number, char: string): React.CSSProperties | undefined =>
    char !== " " && i >= goldenStart
      ? { color: accent, textShadow: `0 0 50px ${hex(accent, 0.65)}` }
      : undefined;

  if (reduceMotion) {
    return (
      <span className={className} aria-label={text}>
        {chars.map((char, i) => (
          <span key={i} style={accentStyle(i, char)}>
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden leading-none">
          <motion.span
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
            style={accentStyle(i, char)}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── scroll-reveal wrapper ──────────────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── section label ("01 / ORIGIN STORY") ───────────────────────────────────── */

function SectionLabel({
  n,
  subtitle,
  accent,
}: {
  n: string;
  subtitle?: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-5 mb-8">
      <span
        className="font-display text-7xl md:text-8xl leading-none tabular-nums"
        style={{ color: accent, opacity: 0.2, textShadow: `0 0 60px ${hex(accent, 0.3)}` }}
      >
        {n}
      </span>
      <div className="flex flex-col gap-2.5">
        <span className="block h-[1px] w-12" style={{ background: accent }} />
        {subtitle && (
          <span
            className="font-body text-[10px] md:text-[11px] tracking-[0.45em] uppercase whitespace-nowrap"
            style={{ color: hex(accent, 0.7) }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── pill badge ─────────────────────────────────────────────────────────────── */

function PillBadge({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md mb-7"
      style={{
        background: hex(accent, 0.06),
        border: `1px solid ${hex(accent, 0.28)}`,
        boxShadow: `0 0 28px ${hex(accent, 0.18)}`,
      }}
    >
      <span
        className="block w-1.5 h-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
      />
      <span
        className="font-body text-[10px] tracking-[0.4em] uppercase"
        style={{ color: accent }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── threat level meter (antagonist) ────────────────────────────────────────── */

function ThreatLevel({ accent, level = 5 }: { accent: string; level?: number }) {
  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex items-center gap-3">
        <span
          className="font-body text-[9px] tracking-[0.5em] uppercase"
          style={{ color: hex(accent, 0.65) }}
        >
          Threat Level
        </span>
        <span className="block h-px flex-1" style={{ background: hex(accent, 0.2) }} />
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => {
          const active = i <= level;
          return (
            <div
              key={i}
              className="h-2.5 flex-1 max-w-[44px]"
              style={{
                background: active ? accent : hex(accent, 0.12),
                boxShadow: active ? `0 0 14px ${hex(accent, 0.55)}` : undefined,
              }}
            />
          );
        })}
        <span
          className="ml-3 font-display text-3xl tabular-nums leading-none"
          style={{ color: accent, textShadow: `0 0 25px ${hex(accent, 0.5)}` }}
        >
          {level}
          <span className="text-luxury-platinum/30 text-xl">/5</span>
        </span>
      </div>
    </div>
  );
}

/* ─── atmospheric quote (storyline middle) ───────────────────────────────────── */

function AtmosphericQuote({ text, accent }: { text: string; accent: string }) {
  return (
    <Reveal>
      <div className="my-24 md:my-32 text-center">
        <div
          className="block h-px w-16 mx-auto mb-10"
          style={{ background: hex(accent, 0.5) }}
        />
        <p
          className="font-display uppercase mx-auto leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
            color: accent,
            textShadow: `0 0 80px ${hex(accent, 0.6)}, 0 0 30px ${hex(accent, 0.3)}`,
            maxWidth: "26ch",
          }}
        >
          &ldquo;{text}&rdquo;
        </p>
        <div
          className="block h-px w-16 mx-auto mt-10"
          style={{ background: hex(accent, 0.5) }}
        />
      </div>
    </Reveal>
  );
}

/* ─── glowing divider ────────────────────────────────────────────────────────── */

function GlowDivider({ accent }: { accent: string }) {
  return (
    <div className="relative h-px w-full my-2">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${hex(accent, 0.5)} 50%, transparent 100%)`,
          boxShadow: `0 0 20px ${hex(accent, 0.4)}`,
        }}
      />
    </div>
  );
}

/* ─── pull-quote ─────────────────────────────────────────────────────────────── */

function PullQuote({
  text,
  accent,
  label = "Final Goal",
}: {
  text: string;
  accent: string;
  label?: string;
}) {
  return (
    <div className="relative">
      {/* Tiny eyebrow label */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="block w-6 h-px"
          style={{ background: hex(accent, 0.6) }}
        />
        <span
          className="font-body text-[9px] tracking-[0.5em] uppercase"
          style={{ color: hex(accent, 0.7) }}
        >
          {label}
        </span>
      </div>
      <blockquote
        className="relative pl-7"
        style={{ borderLeft: `2px solid ${accent}` }}
      >
        <div
          className="absolute -left-px top-0 bottom-0 w-px blur-[6px]"
          style={{ background: accent, opacity: 0.6 }}
        />
        <p
          className="font-display text-2xl md:text-3xl uppercase leading-[1.15] tracking-tight"
          style={{
            color: accent,
            textShadow: `0 0 50px ${hex(accent, 0.5)}`,
          }}
        >
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
    </div>
  );
}

/* ─── portrait card ──────────────────────────────────────────────────────────── */

function PortraitCard({
  src,
  name,
  accent,
}: {
  src: string;
  name: string;
  accent: string;
}) {
  // Treat empty src as "missing" up front so we never request a blank URL.
  const hasSrc = !!src;
  const [failed, setFailed] = useState(!hasSrc);
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "3/4",
        borderRadius: "2px",
        boxShadow: [
          `0 0 0 1px ${hex(accent, 0.25)}`,
          `0 0 100px -10px ${hex(accent, 0.3)}`,
          `0 40px 80px rgba(0,0,0,0.6)`,
        ].join(", "),
      }}
    >
      {/* Deep gradient base — always behind the image */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${hex(accent, 0.14)} 0%, #08080D 55%, #06060A 100%)`,
        }}
      />

      {/* Atmospheric glow blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${hex(accent, 0.18)} 0%, transparent 65%)`,
        }}
      />

      {/* Key art */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          onError={() => setFailed(true)}
        />
      )}

      {/* Placeholder when no image */}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display select-none"
            style={{
              fontSize: "clamp(6rem, 18vw, 12rem)",
              color: accent,
              opacity: 0.3,
              lineHeight: 1,
              textShadow: `0 0 120px ${accent}`,
            }}
          >
            {initials}
          </span>
        </div>
      )}

      {/* Bottom gradient for readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(6,6,10,0.97), rgba(6,6,10,0.6) 50%, transparent)`,
        }}
      />

      {/* Glass inset border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${hex(accent, 0.12)}`,
        }}
      />

      {/* Corner ornaments */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          className={`absolute w-5 h-5 ${
            pos[0] === "t" ? "top-4" : "bottom-4"
          } ${pos[1] === "l" ? "left-4" : "right-4"} border-${
            pos[0] === "t" ? "t" : "b"
          } border-${pos[1] === "l" ? "l" : "r"}`}
          style={{ borderColor: hex(accent, 0.45) }}
        />
      ))}

      {/* Name label at bottom */}
      <div className="absolute bottom-5 inset-x-0 px-5 text-center">
        <p
          className="font-body text-[9px] tracking-[0.4em] uppercase"
          style={{ color: hex(accent, 0.75) }}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

/* ─── floating particles ─────────────────────────────────────────────────────── */

const PARTICLE_DATA = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: 1 + (i * 0.37) % 2.5,
  x: (i * 4.3) % 100,
  y: 5 + (i * 8.7) % 85,
  delay: (i * 1.3) % 9,
  dur: 11 + (i * 1.7) % 11,
  drift: -50 + (i * 9.1) % 100,
}));

function DetailParticles({ accent }: { accent: string }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {PARTICLE_DATA.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: accent,
            boxShadow: `0 0 ${p.size * 5}px ${accent}`,
          }}
          animate={{
            opacity: [0, 0.55, 0.55, 0],
            y: [0, -160],
            x: [0, p.drift],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════════ */

export function AnimeDetail({ anime }: { anime: Anime }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative bg-luxury-black min-h-screen overflow-x-hidden">
      {!reduceMotion && <DetailParticles accent={anime.accentColor} />}
      <HeroSection anime={anime} />
      <StorylineSection anime={anime} />
      <ProtagonistSection anime={anime} />
      <AntagonistSection anime={anime} />
      <BackCTA anime={anime} />
    </div>
  );
}

/* ─── 1. HERO ────────────────────────────────────────────────────────────────── */

function HeroSection({ anime }: { anime: Anime }) {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ["0%", "8%"]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden flex flex-col justify-end"
    >
      {/* ── parallax background ── */}
      <motion.div
        className="absolute inset-[-8%] z-0"
        style={reduceMotion ? undefined : { y: bgY }}
      >
        {/* Base dark */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #06060A 0%, #0D0D14 50%, #0A0A0F 100%)",
          }}
        />
        {/* Atmospheric accent halo */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 55% 40%, ${hex(anime.accentColor, 0.22)} 0%, transparent 65%)`,
          }}
        />
        {/* Hero image — hides itself if 404 or skipped if missing */}
        {anime.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).style.display = "none")
            }
          />
        )}
      </motion.div>

      {/* ── gradient overlays ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(105deg, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.5) 45%, rgba(6,6,10,0.1) 100%),
            linear-gradient(0deg,   rgba(6,6,10,1)    0%, rgba(6,6,10,0.55) 35%, transparent 65%)
          `,
        }}
      />

      {/* ── content ── */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 pb-24 md:pb-32"
      >
        {/* Back breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="flex items-center gap-3 mb-8"
        >
          <span
            className="block w-8 h-px"
            style={{ background: anime.accentColor }}
          />
          <Link
            href="/"
            className="font-body text-[10px] tracking-[0.5em] uppercase transition-opacity hover:opacity-100 opacity-50"
            style={{ color: anime.accentColor }}
          >
            ← Showcase
          </Link>
        </motion.div>

        {/* Kinetic title */}
        <h1
          className="font-display uppercase leading-[0.82] tracking-tight text-luxury-platinum mb-8 select-none"
          style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
        >
          <KineticTitle text={anime.title} accent={anime.accentColor} />
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4, ease: EASE }}
          className="font-body text-base md:text-xl text-luxury-platinum/65 max-w-2xl leading-relaxed"
        >
          {anime.tagline}
        </motion.p>
      </motion.div>

      {/* ── scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span
          className="font-body text-[9px] tracking-[0.45em] uppercase opacity-40"
          style={{ color: anime.accentColor }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-9"
          style={{
            background: `linear-gradient(to bottom, ${anime.accentColor}, transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}

/* ─── storyline image tweaks (per slug) ─────────────────────────────────────── */

const STORYLINE_TWEAKS: Record<string, { scale?: number; position?: string }> = {
  "jujutsu-kaisen": { scale: 0.82 },
  "one-piece":      { scale: 0.88, position: "65% center" },
};

/* ─── 2. STORYLINE ───────────────────────────────────────────────────────────── */

/** Group sentences into N roughly-even chunks. */
function chunkSentences(sentences: string[], chunkCount: number): string[][] {
  if (sentences.length === 0) return [];
  const perChunk = Math.ceil(sentences.length / chunkCount);
  const chunks: string[][] = [];
  for (let i = 0; i < sentences.length; i += perChunk) {
    chunks.push(sentences.slice(i, i + perChunk));
  }
  return chunks;
}

function StoryChunk({
  chunk,
  accent,
  delay,
}: {
  chunk: string[];
  accent: string;
  delay?: number;
}) {
  if (chunk.length === 0) return null;
  const [lead, ...rest] = chunk;
  return (
    <Reveal delay={delay}>
      <div className="space-y-6 max-w-[60ch]">
        <p
          className="font-display uppercase tracking-tight leading-[1.15]"
          style={{
            fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
            color: accent,
            textShadow: `0 0 40px ${hex(accent, 0.4)}`,
          }}
        >
          {lead}
        </p>
        {rest.map((s, i) => (
          <p
            key={i}
            className="font-body text-luxury-silver"
            style={{ fontSize: "1.125rem", lineHeight: 1.85, letterSpacing: "0.01em" }}
          >
            {s}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

function StorylineSection({ anime }: { anime: Anime }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const sentences = parseSentences(anime.synopsis);
  const chunks = chunkSentences(sentences, 3);
  const hasSrc = !!anime.storylineImage;
  const [imgFailed, setImgFailed] = useState(!hasSrc);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #06060A 0%, #0A0A0F 100%)",
        paddingTop: "clamp(120px, 14vw, 200px)",
        paddingBottom: "clamp(120px, 14vw, 200px)",
      }}
    >
      {/* ── storyline background image — full bleed, soft-edge ── */}
      {!imgFailed && (
        <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anime.storylineImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              scale: STORYLINE_TWEAKS[anime.slug]?.scale ?? 1.12,
              objectPosition: STORYLINE_TWEAKS[anime.slug]?.position ?? "center",
            }}
            onError={() => setImgFailed(true)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right,  rgba(6,6,10,0.98) 0%, rgba(6,6,10,0.85) 35%, rgba(6,6,10,0.4) 65%, rgba(6,6,10,0.6) 100%),
                linear-gradient(to bottom, rgba(6,6,10,1) 0%, transparent 15%, transparent 80%, rgba(6,6,10,1) 100%)
              `,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 72% 45%, ${hex(anime.accentColor, 0.12)} 0%, transparent 65%)`,
            }}
          />
        </motion.div>
      )}

      {/* ── left vertical accent line ── */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px overflow-hidden z-10">
        <motion.div
          className="absolute inset-0 origin-top"
          style={{
            scaleY: lineScaleY,
            background: `linear-gradient(to bottom, transparent 0%, ${anime.accentColor} 20%, ${anime.accentColor} 80%, transparent 100%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:pl-28">
        {/* Header */}
        <Reveal className="mb-24 md:mb-28">
          <SectionLabel n="01" subtitle="Origin Story" accent={anime.accentColor} />
          <h2
            className="font-display uppercase leading-[0.85] tracking-tight text-luxury-platinum"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            The Story
          </h2>
        </Reveal>

        {/* First chunk */}
        {chunks[0] && (
          <StoryChunk chunk={chunks[0]} accent={anime.accentColor} delay={0} />
        )}

        {/* Atmospheric pull quote in the middle */}
        <AtmosphericQuote text={anime.tagline} accent={anime.accentColor} />

        {/* Remaining chunks */}
        <div className="space-y-20 md:space-y-24">
          {chunks.slice(1).map((chunk, i) => (
            <StoryChunk
              key={i}
              chunk={chunk}
              accent={anime.accentColor}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Bottom glow divider */}
        <div className="mt-24 md:mt-28">
          <GlowDivider accent={anime.accentColor} />
        </div>
      </div>
    </section>
  );
}

/* ─── 3. PROTAGONIST ─────────────────────────────────────────────────────────── */

function ProtagonistSection({ anime }: { anime: Anime }) {
  const accent = anime.accentColor;
  // Take only the first 2 sentences for scannability
  const shortDescription = parseSentences(anime.protagonist.description)
    .slice(0, 2)
    .join(" ");

  return (
    <section
      className="relative"
      style={{
        background: "#0A0A0F",
        paddingTop: "clamp(120px, 14vw, 200px)",
        paddingBottom: "clamp(120px, 14vw, 200px)",
      }}
    >
      {/* Subtle ambient glow on right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 65% at 85% 50%, ${hex(accent, 0.055)} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
        {/* Header */}
        <Reveal className="mb-20 md:mb-28">
          <SectionLabel n="02" subtitle="The Protagonist" accent={accent} />
          <h2
            className="font-display uppercase leading-[0.85] tracking-tight text-luxury-platinum"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            The Hero
          </h2>
        </Reveal>

        {/* Two-column: portrait left, text right */}
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-14 md:gap-24 items-start">
          {/* Portrait */}
          <Reveal delay={0.05}>
            <PortraitCard
              src={anime.protagonistImage}
              name={anime.protagonist.name}
              accent={accent}
            />
          </Reveal>

          {/* Text */}
          <div className="flex flex-col gap-10 pt-4 md:pt-8">
            {/* Pill badge */}
            <Reveal delay={0.1}>
              <div>
                <PillBadge label="Protagonist" accent={accent} />

                {/* Big name */}
                <h3
                  className="font-display uppercase leading-[0.85] tracking-tight"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 5.5rem)",
                    color: accent,
                    textShadow: `0 0 80px ${hex(accent, 0.5)}`,
                  }}
                >
                  {anime.protagonist.name}
                </h3>
              </div>
            </Reveal>

            {/* Description — trimmed */}
            <Reveal delay={0.25}>
              <p
                className="font-body text-luxury-silver max-w-[60ch]"
                style={{ fontSize: "1.125rem", lineHeight: 1.85, letterSpacing: "0.01em" }}
              >
                {shortDescription}
              </p>
            </Reveal>

            {/* Glowing pull quote */}
            <Reveal delay={0.35}>
              <PullQuote
                text={anime.protagonist.finalGoal}
                accent={accent}
                label="Final Goal"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. ANTAGONIST ──────────────────────────────────────────────────────────── */

function AntagonistSection({ anime }: { anime: Anime }) {
  const accent = VILLAIN_ACCENT;
  const shortDescription = parseSentences(anime.antagonist.description)
    .slice(0, 2)
    .join(" ");

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0F 0%, #0C0609 50%, #0A0A0F 100%)",
        paddingTop: "clamp(120px, 14vw, 200px)",
        paddingBottom: "clamp(120px, 14vw, 200px)",
      }}
    >
      {/* Sinister glow — far right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 88% 50%, ${hex(accent, 0.07)} 0%, transparent 68%)`,
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
        {/* Header */}
        <Reveal className="mb-20 md:mb-28">
          <SectionLabel n="03" subtitle="The Antagonist" accent={accent} />
          <h2
            className="font-display uppercase leading-[0.85] tracking-tight text-luxury-platinum"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            The Villain
          </h2>
        </Reveal>

        {/* Two-column: text left, portrait right — mirrored from hero */}
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-14 md:gap-24 items-start">
          {/* Text — left on desktop, below portrait on mobile */}
          <div className="flex flex-col gap-10 pt-4 md:pt-8 order-2 md:order-1">
            {/* Pill badge */}
            <Reveal delay={0.1}>
              <div>
                <PillBadge label="Antagonist" accent={accent} />

                {/* Big name */}
                <h3
                  className="font-display uppercase leading-[0.85] tracking-tight"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 5.5rem)",
                    color: accent,
                    textShadow: `0 0 80px ${hex(accent, 0.55)}`,
                  }}
                >
                  {anime.antagonist.name}
                </h3>
              </div>
            </Reveal>

            {/* Threat level */}
            <Reveal delay={0.2}>
              <ThreatLevel accent={accent} level={5} />
            </Reveal>

            {/* Description — trimmed */}
            <Reveal delay={0.3}>
              <p
                className="font-body text-luxury-silver max-w-[60ch]"
                style={{ fontSize: "1.125rem", lineHeight: 1.85, letterSpacing: "0.01em" }}
              >
                {shortDescription}
              </p>
            </Reveal>

            {/* Glowing pull quote */}
            <Reveal delay={0.4}>
              <PullQuote
                text={anime.antagonist.finalGoal}
                accent={accent}
                label="Final Goal"
              />
            </Reveal>
          </div>

          {/* Portrait — right on desktop, above text on mobile */}
          <Reveal delay={0.05} className="order-1 md:order-2">
            <PortraitCard
              src={anime.antagonistImage}
              name={anime.antagonist.name}
              accent={accent}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. BACK CTA ────────────────────────────────────────────────────────────── */

function BackCTA({ anime }: { anime: Anime }) {
  const accent = anime.accentColor;

  return (
    <section
      className="relative py-40 px-6"
      style={{ borderTop: `1px solid ${hex(accent, 0.1)}` }}
    >
      {/* Upward glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 90% at 50% 110%, ${hex(accent, 0.07)} 0%, transparent 65%)`,
        }}
      />

      <Reveal className="max-w-xl mx-auto text-center">
        <p
          className="font-body text-[9px] tracking-[0.55em] uppercase mb-7"
          style={{ color: hex(accent, 0.6) }}
        >
          End of profile
        </p>

        <h2
          className="font-display uppercase leading-none tracking-tight text-luxury-platinum mb-14"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          Return to the
          <br />
          <span style={{ color: accent, textShadow: `0 0 60px ${hex(accent, 0.4)}` }}>
            Showcase
          </span>
        </h2>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-4 px-10 py-4 font-body text-xs tracking-[0.35em] uppercase overflow-hidden transition-all duration-500"
          style={{
            border: `1px solid ${hex(accent, 0.6)}`,
            color: accent,
          }}
        >
          {/* Fill sweep */}
          <span
            className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
            style={{ background: accent }}
          />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-luxury-black">
            ← Return
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
