"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, type TargetAndTransition } from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type GlowButtonVariant = "solid" | "outline" | "ghost";
export type GlowButtonSize   = "sm" | "md" | "lg";

export type GlowButtonProps = {
  children: React.ReactNode;
  /** Hex accent color driving the background / border / glow. */
  color?: string;
  /** Renders as <Link> when provided; otherwise <button>. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: GlowButtonVariant;
  size?: GlowButtonSize;
  /** Continuous pulsing glow animation. */
  pulse?: boolean;
  /** Optional icon rendered after the label. */
  icon?: React.ReactNode;
  /** Disabled state. */
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

/* ─── helpers ────────────────────────────────────────────────────────────────── */

function hex(color: string, alpha: number) {
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── size map ───────────────────────────────────────────────────────────────── */

const SIZE: Record<GlowButtonSize, { px: string; py: string; text: string; tracking: string }> = {
  sm: { px: "px-5",  py: "py-2",   text: "text-[9px]",  tracking: "tracking-[0.2em]" },
  md: { px: "px-8",  py: "py-3.5", text: "text-[10px]", tracking: "tracking-[0.28em]" },
  lg: { px: "px-11", py: "py-4.5", text: "text-xs",     tracking: "tracking-[0.35em]" },
};

/* ─── variant styles ─────────────────────────────────────────────────────────── */

type StyleResult = {
  base: React.CSSProperties;
  hover: TargetAndTransition;
  pulse?: TargetAndTransition;
};

function buildStyles(
  color: string,
  variant: GlowButtonVariant,
  pulse: boolean,
): StyleResult {
  const glow0 = `0 0 0px 0px ${hex(color, 0.5)}`;
  const glowPeak = `0 0 26px 8px ${hex(color, 0.22)}`;
  const glowHover = `0 0 40px 6px ${hex(color, 0.35)}`;

  switch (variant) {
    case "solid":
      return {
        base: {
          background: color,
          color: "#0A0A0F",
          boxShadow: pulse ? glow0 : `0 4px 24px ${hex(color, 0.3)}`,
        },
        hover: {
          background: color,
          boxShadow: glowHover,
        },
        pulse: pulse
          ? { boxShadow: [glow0, glowPeak, glow0] }
          : undefined,
      };

    case "outline":
      return {
        base: {
          background: "transparent",
          color: color,
          border: `1px solid ${hex(color, 0.65)}`,
          boxShadow: pulse ? glow0 : "none",
        },
        hover: {
          background: hex(color, 0.08),
          boxShadow: glowHover,
          borderColor: color,
        },
        pulse: pulse
          ? { boxShadow: [glow0, glowPeak, glow0] }
          : undefined,
      };

    case "ghost":
      return {
        base: {
          background: "transparent",
          color: color,
          boxShadow: "none",
        },
        hover: {
          background: hex(color, 0.08),
          boxShadow: `0 0 20px ${hex(color, 0.2)}`,
        },
        pulse: pulse
          ? { color: [color, `${color}CC`, color] }
          : undefined,
      };
  }
}

/* ─── inner content ──────────────────────────────────────────────────────────── */

function ButtonInner({
  children,
  icon,
  color,
  variant,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  color: string;
  variant: GlowButtonVariant;
}) {
  return (
    <>
      {/* Fill sweep overlay (outline only) */}
      {variant === "outline" && (
        <span
          className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: color }}
          aria-hidden
        />
      )}

      <span className="relative z-10 flex items-center gap-2.5 transition-colors duration-300 group-hover:text-luxury-black">
        {children}
        {icon && (
          <span className="inline-block transition-transform duration-400 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </>
  );
}

/* ─── component ─────────────────────────────────────────────────────────────── */

export const GlowButton = forwardRef<HTMLElement, GlowButtonProps>(
function GlowButton(
  {
    children,
    color = "#C9A84C",
    href,
    onClick,
    variant = "outline",
    size = "md",
    pulse = false,
    icon,
    disabled = false,
    className = "",
  },
  // ref forwarding kept for API compatibility; motion.div manages its own ref
  _ref, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const styles = buildStyles(color, variant, pulse);
  const sz = SIZE[size];

  const sharedClassName = [
    "group relative inline-flex items-center justify-center overflow-hidden",
    "font-body uppercase font-medium cursor-pointer select-none",
    "transition-opacity duration-300",
    sz.px,
    sz.py,
    sz.text,
    sz.tracking,
    disabled ? "opacity-40 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pulseTransition = {
    duration: 2.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  const motionProps = {
    className: sharedClassName,
    style: styles.base,
    whileHover: styles.hover,
    animate: styles.pulse,
    transition: styles.pulse ? pulseTransition : undefined,
  } as const;

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className="contents" tabIndex={disabled ? -1 : undefined}>
          <ButtonInner color={color} variant={variant} icon={icon}>
            {children}
          </ButtonInner>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...motionProps}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={disabled ? undefined : (onClick as unknown as React.MouseEventHandler<HTMLDivElement>)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
      }}
    >
      <ButtonInner color={color} variant={variant} icon={icon}>
        {children}
      </ButtonInner>
    </motion.div>
  );
});
