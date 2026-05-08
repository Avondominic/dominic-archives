"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type FloatingParticlesProps = {
  /** Hex or CSS color for particles and their glow. */
  color?: string;
  /** Number of particles to render. */
  count?: number;
  /** [min, max] radius in px. */
  sizeRange?: [number, number];
  /** Controls animation duration multiplier. */
  speed?: "slow" | "medium" | "fast";
  /** Global opacity cap for all particles (0–1). */
  opacity?: number;
  /** Use fixed (viewport-relative) or absolute positioning. */
  fixed?: boolean;
  /** Extra class names on the container. */
  className?: string;
};

/* ─── helpers ────────────────────────────────────────────────────────────────── */

const SPEED_FACTOR = { slow: 1.7, medium: 1.0, fast: 0.5 } as const;

/** Deterministic pseudo-random value in [0, range) seeded by index and salt. */
function det(i: number, salt: number, range: number) {
  return ((i * 127.3 + salt * 311.7) % range + range) % range;
}

function hex(color: string, alpha: number) {
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── component ─────────────────────────────────────────────────────────────── */

export function FloatingParticles({
  color = "#C9A84C",
  count = 24,
  sizeRange = [1, 3.5],
  speed = "medium",
  opacity = 1,
  fixed = true,
  className = "",
}: FloatingParticlesProps) {
  const reduceMotion = useReducedMotion();
  const [minSize, maxSize] = sizeRange;
  const speedFactor = SPEED_FACTOR[speed];

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: minSize + (det(i, 1, maxSize - minSize + 1)),
        x: det(i, 2, 100),
        y: det(i, 3, 85) + 5,
        delay: det(i, 4, 9),
        duration: (10 + det(i, 5, 12)) * speedFactor,
        drift: -60 + det(i, 6, 120),
        peakOpacity: 0.3 + (det(i, 7, 55) / 100),
      })),
    [count, minSize, maxSize, speedFactor],
  );

  const isValidHex = /^#([0-9A-Fa-f]{6})$/.test(color);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className={`inset-0 z-0 pointer-events-none overflow-hidden ${fixed ? "fixed" : "absolute"} ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            ...(isValidHex
              ? { boxShadow: `0 0 ${p.size * 4}px ${hex(color, 0.7)}` }
              : {}),
          }}
          animate={{
            opacity: [0, p.peakOpacity * opacity, p.peakOpacity * opacity, 0],
            y: [0, -(100 + p.size * 10)],
            x: [0, p.drift],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
