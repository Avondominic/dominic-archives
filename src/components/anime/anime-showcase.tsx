"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ANIME_EXTENDED as ANIME, type AnimeWithLegacy as Anime } from "@/data/anime";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SWIPE_THRESHOLD = 48;

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/** Generates a tiny solid-color SVG data URL for use as blurDataURL. */
function accentToDataURL(hex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${hex}"/></svg>`;
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

/** Silently preloads all hero image srcs using browser Image API. */
function PreloadImages({ srcs }: { srcs: string[] }) {
  useEffect(() => {
    srcs.forEach((src) => {
      if (!src) return;
      const img = new window.Image();
      img.src = src;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── main component ──────────────────────────────────────────────────────── */

export function AnimeShowcase() {
  const [index, setIndex]       = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion            = useReducedMotion();
  const current                 = ANIME[index];
  const total                   = ANIME.length;

  /* ── navigation ── */
  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total],
  );
  const next = useCallback(() => goTo(index + 1,  1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ── touch swipe ── */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only fire if predominantly horizontal and above threshold
    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  };

  /* ── mouse parallax (desktop only, skipped when reduceMotion) ── */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });
  const bgX    = useTransform(sx, (v) => reduceMotion ? "0px" : `${v * -20}px`);
  const bgY    = useTransform(sy, (v) => reduceMotion ? "0px" : `${v * -20}px`);
  const titleX = useTransform(sx, (v) => reduceMotion ? "0px" : `${v * 8}px`);
  const titleY = useTransform(sy, (v) => reduceMotion ? "0px" : `${v * 8}px`);

  useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    const onMove = (e: MouseEvent) => {
      px.set((e.clientX / window.innerWidth)  * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py, reduceMotion]);

  /* ── transition config (respects reduced motion) ── */
  const xfadeDuration = reduceMotion ? 0 : 0.8;
  const zoomDuration  = reduceMotion ? 0 : 8;

  return (
    <section
      id="showcase"
      className="relative h-screen w-full overflow-hidden bg-luxury-void"
      aria-roledescription="carousel"
      aria-label="Featured anime"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── preload all hero images silently on mount ── */}
      <PreloadImages srcs={ANIME.map((a) => a.image)} />

      {/* ── background crossfade ── */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={current.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              opacity: { duration: xfadeDuration, ease: EASE },
              scale:   { duration: zoomDuration,  ease: "linear" },
            },
          }}
          exit={{ opacity: 0, transition: { duration: xfadeDuration, ease: EASE } }}
        >
          {/* Parallax art wrapper */}
          <motion.div className="absolute inset-[-5%]" style={{ x: bgX, y: bgY }}>
            <HeroImage
              src={current.image}
              alt={current.title}
              slug={current.slug}
            />
          </motion.div>

          {/* Left accent glow */}
          <div
            className="absolute left-0 top-0 h-full w-2/3 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 70% at 25% 55%, ${hexToRgba(current.accent, 0.28)} 0%, transparent 60%)`,
            }}
          />

          {/* Readability gradients */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(90deg,  rgba(6,6,10,0.92) 0%,  rgba(6,6,10,0.55) 38%, rgba(6,6,10,0.12) 65%, rgba(6,6,10,0.5) 100%),
                linear-gradient(180deg, rgba(6,6,10,0.38) 0%,  transparent 25%, transparent 58%, rgba(6,6,10,0.9) 100%)
              `,
            }}
          />

          {/* Ambient sweep — skip when reduced motion */}
          {!reduceMotion && (
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              initial={{ backgroundPosition: "0% 0%" }}
              animate={{ backgroundPosition: "100% 100%" }}
              transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(current.accent, 0.15)} 0%, transparent 40%, ${hexToRgba(current.accentSoft, 0.1)} 100%)`,
                backgroundSize: "200% 200%",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── particles ── */}
      {!reduceMotion && <ParticleField key={current.slug} accent={current.accent} />}

      {/* ── text (center-left) ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
          <motion.div style={{ x: titleX, y: titleY }} className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
                  className="flex items-center gap-3 mb-4 sm:mb-6"
                >
                  <span className="block w-8 sm:w-12 h-px" style={{ background: current.accent }} />
                  <span
                    className="font-body text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase"
                    style={{ color: current.accent }}
                  >
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* Title */}
                <div className="overflow-hidden mb-4 sm:mb-6">
                  <motion.h1
                    initial={{ y: reduceMotion ? 0 : "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: reduceMotion ? 0 : "-110%" }}
                    transition={{ duration: 0.75, ease: EASE_SHARP, delay: 0 }}
                    className="font-display uppercase leading-[0.85] tracking-tight text-luxury-platinum"
                    style={{
                      fontSize: "clamp(2.2rem, 10vw, 11rem)",
                      textShadow: `0 0 80px ${hexToRgba(current.accent, 0.45)}, 0 4px 30px rgba(0,0,0,0.6)`,
                    }}
                  >
                    {current.title}
                  </motion.h1>
                </div>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
                  className="font-body text-sm sm:text-base md:text-xl text-luxury-platinum/75 max-w-sm sm:max-w-xl leading-relaxed mb-6 sm:mb-8 md:mb-10"
                >
                  {current.tagline}
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
                >
                  <Link
                    href={`/anime/${current.slug}`}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-6 sm:px-9 py-4 sm:py-4 font-body text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase font-medium overflow-hidden transition-all duration-500"
                    style={{
                      background: current.accent,
                      color: "#0A0A0F",
                      boxShadow: `0 0 0 1px ${current.accent}, 0 0 60px ${hexToRgba(current.accent, 0.45)}`,
                    }}
                  >
                    <span className="relative z-10">Enter</span>
                    <span className="relative z-10 inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    <span
                      className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                      style={{ background: current.accentSoft }}
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── arrows — hidden on touch screens, shown md+ ── */}
      <NavArrow direction="left"  onClick={prev} accent={current.accent} label="Previous anime" />
      <NavArrow direction="right" onClick={next} accent={current.accent} label="Next anime" />

      {/* ── swipe hint — mobile only ── */}
      <div className="md:hidden absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 font-body text-[9px] tracking-[0.35em] uppercase text-luxury-platinum/35">
        <span>←</span>
        <span>Swipe</span>
        <span>→</span>
      </div>

      {/* ── dot indicators ── */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        {ANIME.map((a, i) => {
          const active = i === index;
          return (
            <button
              key={a.slug}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to ${a.title}`}
              aria-current={active}
              className="h-4 flex items-center px-0.5"
            >
              <motion.span
                animate={{
                  width: active ? 32 : 6,
                  backgroundColor: active ? current.accent : "rgba(232,232,240,0.25)",
                }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
                className="block h-[2px] rounded-full"
                style={active ? { boxShadow: `0 0 10px ${hexToRgba(current.accent, 0.7)}` } : undefined}
              />
            </button>
          );
        })}
      </div>

      {/* ── counter (desktop) ── */}
      <div className="absolute top-28 right-8 md:right-16 z-20 hidden sm:flex items-center gap-2 font-display text-luxury-platinum/70">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={current.slug}
            initial={{ y: reduceMotion ? 0 : direction * 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduceMotion ? 0 : -direction * 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="text-4xl md:text-5xl tabular-nums"
            style={{ color: current.accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span className="text-lg md:text-xl text-luxury-platinum/30">/</span>
        <span className="text-lg md:text-xl text-luxury-platinum/40 tabular-nums">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── keyboard hint (desktop) ── */}
      <div className="hidden md:flex absolute bottom-10 left-8 z-20 items-center gap-2 font-body text-[10px] tracking-[0.4em] uppercase text-luxury-platinum/35">
        <kbd className="px-1.5 py-0.5 border border-luxury-platinum/15 rounded text-[10px]">←</kbd>
        <kbd className="px-1.5 py-0.5 border border-luxury-platinum/15 rounded text-[10px]">→</kbd>
        <span>Navigate</span>
      </div>
    </section>
  );
}

/* ─── hero image w/ fallback ──────────────────────────────────────────────── */

// Per-anime hero tweaks: zoom < 1 = pulled back, customized filters per slug.
const HERO_TWEAKS: Record<string, { zoom?: number; filter?: string; sharpen?: boolean; position?: string }> = {
  "jujutsu-kaisen": {
    filter: "contrast(1.45) brightness(1.28) saturate(1.32)",
    sharpen: true,
    zoom: 0.78,
  },
  "bleach":        { zoom: 0.82 },
  "demon-slayer":  { zoom: 0.75, position: "center 30%" },
  "blue-lock":     { zoom: 0.86 },
  "death-note":    { zoom: 0.8 },
  "one-punch-man": { zoom: 0.8 },
  "one-piece":     { zoom: 0.78 },
  "tokyo-revengers": { zoom: 0.72 },
  "spy-x-family":    { zoom: 0.7 },
};

function HeroImage({
  src,
  alt,
  slug,
}: {
  src: string;
  alt: string;
  slug: string;
}) {
  const hasSrc = !!src;
  const [failed, setFailed] = useState(!hasSrc);
  if (failed) return null;

  const tweak          = HERO_TWEAKS[slug] ?? {};
  const filter         = tweak.filter ?? "contrast(1.12) brightness(1.18) saturate(1.1)";
  const zoom           = tweak.zoom ?? 1;
  const composedFilter = tweak.sharpen ? `${filter} url(#hero-sharpen)` : filter;
  const blurDataURL    = accentToDataURL("#0A0A0F");

  return (
    <>
      {tweak.sharpen && (
        <svg className="absolute w-0 h-0" aria-hidden>
          <defs>
            <filter id="hero-sharpen">
              <feConvolveMatrix
                order="3"
                preserveAlpha="true"
                kernelMatrix="0 -0.6 0  -0.6 3.4 -0.6  0 -0.6 0"
              />
            </filter>
          </defs>
        </svg>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        quality={80}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
        style={{
          filter: composedFilter,
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: "center",
          objectPosition: tweak.position ?? "center",
        }}
        onError={() => setFailed(true)}
      />
    </>
  );
}

/* ─── nav arrow ───────────────────────────────────────────────────────────── */

function NavArrow({
  direction,
  onClick,
  accent,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  accent: string;
  label: string;
}) {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        group absolute top-1/2 -translate-y-1/2 z-20
        ${isLeft ? "left-3 md:left-6" : "right-3 md:right-6"}
        hidden md:flex w-12 h-12 md:w-14 md:h-14 items-center justify-center
        transition-all duration-500
      `}
    >
      <span className="absolute inset-0 rounded-full border border-luxury-platinum/18 group-hover:scale-110 transition-transform duration-500" />
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(accent, 0.25)} 0%, transparent 70%)`,
          boxShadow: `0 0 28px ${hexToRgba(accent, 0.4)}`,
        }}
      />
      <span
        className={`relative font-display text-2xl md:text-3xl text-luxury-platinum transition-transform duration-500 ${
          isLeft ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
        }`}
      >
        {isLeft ? "←" : "→"}
      </span>
    </button>
  );
}

/* ─── particles ───────────────────────────────────────────────────────────── */

const PARTICLE_DATA = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: 1 + (i * 0.41) % 3,
  x: (i * 3.71) % 100,
  y: (i * 8.93) % 100,
  delay: (i * 1.27) % 7,
  duration: 8 + (i * 1.83) % 11,
  drift: -35 + (i * 8.17) % 70,
}));

function ParticleField({ accent }: { accent: string }) {
  const particles = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return PARTICLE_DATA.slice(0, 10);
    }
    return PARTICLE_DATA;
  }, []);
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: accent,
            boxShadow: `0 0 ${p.size * 4}px ${accent}`,
          }}
          animate={{ opacity: [0, 0.75, 0.75, 0], y: [-15, -130], x: [0, p.drift] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export type { Anime };
