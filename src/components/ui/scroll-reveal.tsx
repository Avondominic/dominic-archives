"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants, type TargetAndTransition, type HTMLMotionProps } from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type RevealVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "fadeIn"
  | "scale"
  | "scaleUp";

export type ScrollRevealProps = {
  children: React.ReactNode;
  /** Animation preset. Default: "fadeUp". */
  variant?: RevealVariant;
  /** Seconds to delay the animation after entering view. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Intersection margin — negative values trigger before element fully enters. */
  margin?: `${number}%` | `${number}px`;
  /** Fire once (true) or every time the element enters/exits view (false). */
  once?: boolean;
  /** Distance in px for translate-based variants. */
  distance?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "transition">;

/* ─── variant map ────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function buildVariants(variant: RevealVariant, distance: number): Variants {
  const map: Record<RevealVariant, Record<string, TargetAndTransition>> = {
    fadeUp: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.75, y: distance / 2 },
      visible: { opacity: 1, scale: 1, y: 0 },
    },
  };
  return map[variant];
}

/* ─── component ─────────────────────────────────────────────────────────────── */

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.9,
  margin = "-8%",
  once = true,
  distance = 38,
  className,
  ...rest
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once,
    margin,
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = buildVariants(variant, distance);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ─── stagger container helper ───────────────────────────────────────────────── */

export type StaggerRevealProps = {
  children: React.ReactNode;
  /** Delay between each child's animation. */
  stagger?: number;
  /** Delay before the first child animates. */
  delayChildren?: number;
  margin?: `${number}%` | `${number}px`;
  once?: boolean;
  className?: string;
};

/**
 * Wraps children in a stagger container. Each direct child should be a
 * <ScrollReveal> with variant="fadeUp" (or any variant) — parent controls
 * the stagger timing.
 */
export function StaggerReveal({
  children,
  stagger = 0.1,
  delayChildren = 0,
  margin = "-8%",
  once = true,
  className,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once,
    margin,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
