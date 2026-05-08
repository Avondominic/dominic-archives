"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ─── constants ──────────────────────────────────────────────────────────────── */

const SESSION_KEY = "da_visited_v2";

// Phase timeline (ms)
const T = {
  brushStart:  800,   // Step 2 starts — brush sweeps
  glowStart:   2000,  // Step 3 — Japanese text glows
  dripStart:   2550,  // Step 3 — ink drips down
  unmount:     3350,  // Step 4 — screen gone
} as const;

type Phase = "title" | "brush" | "glow" | "drip";

/* ─── component ─────────────────────────────────────────────────────────────── */

export function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible]   = useState(false);
  const [phase, setPhase]       = useState<Phase>("title");
  const initialized             = useRef(false);

  // Effect 1: decide whether to show (runs once, sets visible)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (reduceMotion || sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect 2: drive phase transitions (runs whenever visible flips to true)
  // Splitting from Effect 1 means StrictMode remounts re-start the timers correctly.
  useEffect(() => {
    if (!visible) return;

    const timers = [
      setTimeout(() => setPhase("brush"),  T.brushStart),
      setTimeout(() => setPhase("glow"),   T.glowStart),
      setTimeout(() => setPhase("drip"),   T.dripStart),
      setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
      }, T.unmount),
    ];

    return () => timers.forEach(clearTimeout);
  }, [visible]);

  // Replay (for demo/tweaks — call from browser console: window.__replayLoader?.())
  useEffect(() => {
    (window as Window & { __replayLoader?: () => void }).__replayLoader = () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.reload();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#0A0A0F" }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* ── STEP 1 & 2: Text container ── */}
          <motion.div
            className="relative flex items-center justify-center"
            /* STEP 3: drip exit — whole block slides & bleeds downward */
            animate={
              phase === "drip"
                ? {
                    y: 180,
                    opacity: 0,
                    filter: "blur(18px)",
                    scaleX: 0.96,
                  }
                : { y: 0, opacity: 1, filter: "blur(0px)", scaleX: 1 }
            }
            transition={
              phase === "drip"
                ? { duration: 0.75, ease: [0.4, 0, 0.9, 0.6] }
                : { duration: 0 }
            }
          >
            {/* ── "Dominic Archives" — fades out as brush sweeps ── */}
            <motion.h1
              className="font-display uppercase text-center leading-none tracking-[0.08em]"
              style={{ fontSize: "clamp(2.8rem, 6vw, 80px)", color: "#ffffff" }}
              initial={{ opacity: 0, y: 22 }}
              animate={{
                opacity: phase === "title" ? 1 : 0,
                y: phase === "title" ? 0 : -8,
              }}
              transition={
                phase === "title"
                  ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.45, ease: [0.4, 0, 1, 1] }
              }
            >
              Dominic Archives
            </motion.h1>

            {/* ── "支配者の記録" — brush-reveals left to right ── */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              /* Clip starts fully hidden, sweeps open left-to-right */
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{
                clipPath:
                  phase === "brush" || phase === "glow" || phase === "drip"
                    ? "inset(0 0% 0 0)"
                    : "inset(0 100% 0 0)",
              }}
              transition={{
                clipPath: {
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              <motion.span
                className="text-white text-center leading-none whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-hina), serif",
                  fontSize: "clamp(2.8rem, 6vw, 80px)",
                  /* Ink bleed — soft white halo around each kanji */
                  textShadow: [
                    "0 0 6px rgba(255,255,255,0.55)",
                    "0 0 14px rgba(255,255,255,0.25)",
                    "1px 1px 4px rgba(255,255,255,0.2)",
                    "-1px -1px 4px rgba(255,255,255,0.2)",
                    "0 2px 8px rgba(255,255,255,0.15)",
                    "0 -2px 8px rgba(255,255,255,0.15)",
                  ].join(", "),
                }}
                /* STEP 3: glow pulse */
                animate={
                  phase === "glow"
                    ? {
                        textShadow: [
                          /* base */
                          "0 0 6px rgba(255,255,255,0.55), 0 0 14px rgba(255,255,255,0.25), 1px 1px 4px rgba(255,255,255,0.2), -1px -1px 4px rgba(255,255,255,0.2)",
                          /* peak glow */
                          "0 0 20px rgba(255,255,255,0.95), 0 0 45px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.4), 2px 2px 8px rgba(255,255,255,0.35), -2px -2px 8px rgba(255,255,255,0.35)",
                          /* settle back */
                          "0 0 10px rgba(255,255,255,0.65), 0 0 24px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.22), -1px -1px 5px rgba(255,255,255,0.22)",
                        ],
                      }
                    : {}
                }
                transition={
                  phase === "glow"
                    ? { duration: 0.55, ease: "easeInOut", times: [0, 0.45, 1] }
                    : {}
                }
              >
                支配者の記録
              </motion.span>
            </motion.div>
          </motion.div>

          {/* ── STEP 2: Full-screen ink brush stroke ── */}
          <AnimatePresence>
            {(phase === "brush") && (
              <motion.div
                key="brush-stroke"
                className="absolute inset-y-0 pointer-events-none z-10"
                style={{
                  width: "18vw",
                  /* Organic brush shape: thick in center, feathered edges */
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 8%, rgba(255,255,255,0.13) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.13) 70%, rgba(255,255,255,0.04) 92%, transparent 100%)",
                  filter: "blur(10px)",
                }}
                initial={{ left: "-18vw" }}
                animate={{ left: "110vw" }}
                exit={{ opacity: 0 }}
                transition={{
                  left: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Thin ink smear at very bottom of brush (leading edge detail) ── */}
          <AnimatePresence>
            {phase === "brush" && (
              <motion.div
                key="brush-edge"
                className="absolute pointer-events-none z-10"
                style={{
                  width: "2px",
                  top: "10%",
                  bottom: "10%",
                  background:
                    "linear-gradient(180deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 70%, transparent)",
                  filter: "blur(1.5px)",
                  boxShadow: "0 0 12px rgba(255,255,255,0.5)",
                }}
                initial={{ left: "-2px" }}
                animate={{ left: "100vw" }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
