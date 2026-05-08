"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type LoadingScreenProps = {
  /** Text rendered as the main display wordmark. */
  brandName?: string;
  /** Subtitle below the wordmark. */
  tagline?: string;
  /** Total duration of the loading phase in ms (excl. exit animation). */
  duration?: number;
  /** Hex accent color for progress bar, counter, and glow. */
  accentColor?: string;
  /**
   * When true, checks sessionStorage so returning visitors skip the
   * intro on subsequent page loads within the same browser tab session.
   */
  skipOnReturn?: boolean;
  /** Called when the exit animation finishes and the screen unmounts. */
  onComplete?: () => void;
};

/* ─── helpers ────────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SESSION_KEY = "ls_visited";

function hex(color: string, alpha: number) {
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── component ─────────────────────────────────────────────────────────────── */

export function LoadingScreen({
  brandName = "Brand",
  tagline = "Premium Experience",
  duration = 2200,
  accentColor = "#C9A84C",
  skipOnReturn = true,
  onComplete,
}: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");
  const [displayCount, setDisplayCount] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const initialized = useRef(false);

  // ── Decide whether to show at all ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (reduceMotion || (skipOnReturn && sessionStorage.getItem(SESSION_KEY))) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onComplete?.();
      return;
    }

    setVisible(true);
  }, [reduceMotion, skipOnReturn, onComplete]);

  // ── Animate counter and drive phases ──
  useEffect(() => {
    if (!visible) return;

    const unsub = rounded.on("change", (v) => setDisplayCount(v));

    const ctrl = animate(count, 100, {
      duration: duration / 1000,
      ease: EASE,
    });

    const revealTimer = setTimeout(
      () => setPhase("reveal"),
      duration,
    );

    const exitTimer = setTimeout(() => {
      setPhase("exit");
      sessionStorage.setItem(SESSION_KEY, "1");

      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 900);
    }, duration + 500);

    return () => {
      ctrl.stop();
      unsub();
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
    };
  }, [visible, count, rounded, duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#06060A" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {/* ── Radial ambient glow ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: phase === "reveal" ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${hex(accentColor, 0.09)} 0%, transparent 70%)`,
            }}
          />

          {/* ── Top accent line ── */}
          <motion.div
            className="absolute top-0 inset-x-0 h-px"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }}
          />

          {/* ── Brand wordmark ── */}
          <div className="relative flex flex-col items-center gap-5">
            <motion.div
              initial={{ opacity: 0, y: 18, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.55em" }}
              transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
              className="font-display uppercase text-luxury-platinum"
              style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)", lineHeight: 1 }}
            >
              {brandName}
            </motion.div>

            {/* Gold divider */}
            <motion.div
              className="h-px w-40 origin-center"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, delay: 0.6, ease: EASE }}
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-body text-[9px] tracking-[0.45em] uppercase"
              style={{ color: accentColor }}
            >
              {tagline}
            </motion.p>
          </div>

          {/* ── Progress area ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 w-56"
          >
            {/* Counter */}
            <span
              className="font-display tabular-nums leading-none"
              style={{
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                color: accentColor,
                textShadow: `0 0 30px ${hex(accentColor, 0.6)}`,
              }}
            >
              {displayCount}
            </span>

            {/* Track */}
            <div
              className="relative w-full h-px overflow-hidden"
              style={{ background: "rgba(42,42,58,0.6)" }}
            >
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 h-full"
                style={{ width: `${displayCount}%` }}
                transition={{ duration: 0.04, ease: "linear" }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(90deg, ${hex(accentColor, 0.6)}, ${accentColor})`,
                  }}
                />
                {/* Shimmer head */}
                <div
                  className="absolute right-0 top-0 h-full w-7"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ── Exit curtain — wipes upward ── */}
          <AnimatePresence>
            {phase === "exit" && (
              <motion.div
                key="curtain"
                className="absolute inset-0 z-10"
                style={{ background: "#06060A", transformOrigin: "bottom" }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.85, ease: EXIT_EASE }}
              />
            )}
          </AnimatePresence>

          {/* ── Corner ornaments ── */}
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <div
              key={pos}
              className={`absolute w-7 h-7 ${pos[0] === "t" ? "top-7" : "bottom-7"} ${pos[1] === "l" ? "left-7" : "right-7"}`}
              style={{
                borderTop:    pos[0] === "t" ? `1px solid ${hex(accentColor, 0.4)}` : undefined,
                borderBottom: pos[0] === "b" ? `1px solid ${hex(accentColor, 0.4)}` : undefined,
                borderLeft:   pos[1] === "l" ? `1px solid ${hex(accentColor, 0.4)}` : undefined,
                borderRight:  pos[1] === "r" ? `1px solid ${hex(accentColor, 0.4)}` : undefined,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
