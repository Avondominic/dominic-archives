"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type CursorGlowProps = {
  /** Hex color of the glow circle. */
  color?: string;
  /** Diameter in px of the glow disc. */
  size?: number;
  /** Extra blur applied via CSS filter. */
  blur?: number;
  /** Opacity of the glow disc (0–1). */
  opacity?: number;
  /** CSS mix-blend-mode for compositing. */
  blendMode?: "screen" | "overlay" | "multiply" | "lighten" | "normal";
  /** Spring stiffness — higher = snappier tracking. */
  stiffness?: number;
  /** Spring damping — higher = less oscillation. */
  damping?: number;
};

/* ─── component ─────────────────────────────────────────────────────────────── */

export function CursorGlow({
  color = "#C9A84C",
  size = 340,
  blur = 80,
  opacity = 0.18,
  blendMode = "screen",
  stiffness = 90,
  damping = 20,
}: CursorGlowProps) {
  const rawX = useMotionValue(-size * 2);
  const rawY = useMotionValue(-size * 2);
  const isVisible = useRef(false);

  const springX = useSpring(rawX, { stiffness, damping, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness, damping, mass: 0.5 });

  // Offset so the center of the disc tracks the cursor, not the top-left corner
  const x = useTransform(springX, (v) => v - size / 2);
  const y = useTransform(springY, (v) => v - size / 2);

  useEffect(() => {
    // Only activate on pointer:fine (mouse) devices
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      if (!isVisible.current) isVisible.current = true;
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const onLeave = () => {
      rawX.set(-size * 2);
      rawY.set(-size * 2);
      isVisible.current = false;
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY, size]);

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[9990] pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        x,
        y,
        opacity,
        mixBlendMode: blendMode,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}
