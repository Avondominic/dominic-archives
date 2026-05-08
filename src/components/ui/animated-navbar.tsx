"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type NavLink = {
  label: string;
  href: string;
};

export type AnimatedNavbarProps = {
  /** Left-side logo slot. Overrides logoText when provided. */
  logo?: React.ReactNode;
  /** Fallback text logo if no logo ReactNode is supplied. */
  logoText?: string;
  links?: NavLink[];
  cta?: { label: string; href: string };
  /** Hex accent color used for link underlines, CTA border, and logo ornament. */
  accentColor?: string;
  /** Slide the navbar off-screen when scrolling down past threshold. */
  hideOnScrollDown?: boolean;
  className?: string;
};

/* ─── constants ─────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function hex(color: string, alpha: number) {
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── component ─────────────────────────────────────────────────────────────── */

export function AnimatedNavbar({
  logo,
  logoText = "Brand",
  links = [],
  cta,
  accentColor = "#C9A84C",
  hideOnScrollDown = true,
  className = "",
}: AnimatedNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastY.current;
    const dir = latest - prev;

    if (hideOnScrollDown && latest > 80 && dir > 0) setHidden(true);
    else setHidden(false);

    setScrolled(latest > 24);
    lastY.current = latest;
  });

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-115%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.42, ease: EASE }}
      className={`fixed top-0 inset-x-0 z-[100] ${className}`}
    >
      {/* Glass pane */}
      <motion.div
        animate={{
          paddingTop: scrolled ? "0.75rem" : "1.2rem",
          paddingBottom: scrolled ? "0.75rem" : "1.2rem",
        }}
        transition={{ duration: 0.38, ease: EASE }}
        className="transition-shadow duration-500"
        style={{
          background: scrolled
            ? "rgba(10,10,15,0.82)"
            : "rgba(10,10,15,0.5)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? hex(accentColor, 0.1) : "rgba(42,42,58,0.3)"}`,
          boxShadow: scrolled
            ? "0 1px 50px rgba(0,0,0,0.35)"
            : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" aria-label="Home" className="flex items-center gap-3 no-underline group">
            {logo ?? (
              <>
                {/* Diamond ornament */}
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 border"
                    style={{ rotate: 45, borderColor: hex(accentColor, 0.5) }}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                  />
                </div>
                <motion.span
                  animate={{ letterSpacing: scrolled ? "0.22em" : "0.32em" }}
                  transition={{ duration: 0.38 }}
                  className="font-display text-[1.1rem] uppercase text-luxury-platinum"
                >
                  {logoText}
                </motion.span>
              </>
            )}
          </Link>

          {/* ── Nav links ── */}
          {links.length > 0 && (
            <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <NavItem link={link} accentColor={accentColor} />
                </li>
              ))}
            </ul>
          )}

          {/* ── CTA ── */}
          <div className="flex items-center gap-4">
            {cta && (
              <Link
                href={cta.href}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                  border: `1px solid ${accentColor}`,
                  color: accentColor,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = accentColor;
                  (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0F";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = accentColor;
                }}
              >
                {cta.label}
              </Link>
            )}

            {/* Mobile hamburger */}
            {links.length > 0 && (
              <button
                className="md:hidden flex flex-col gap-[5px] p-1 group"
                aria-label="Menu"
              >
                <span
                  className="block w-5 h-px transition-all duration-300"
                  style={{ background: "rgba(232,232,240,0.8)" }}
                />
                <span
                  className="block w-3 h-px transition-all duration-300"
                  style={{ background: accentColor }}
                />
              </button>
            )}
          </div>
        </nav>
      </motion.div>

      {/* Accent sweep line below navbar — visible when scrolled */}
      <motion.div
        animate={{ opacity: scrolled ? 0.18 : 0 }}
        transition={{ duration: 0.4 }}
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </motion.header>
  );
}

/* ─── nav item ───────────────────────────────────────────────────────────────── */

function NavItem({
  link,
  accentColor,
}: {
  link: NavLink;
  accentColor: string;
}) {
  return (
    <Link
      href={link.href}
      className="relative group font-body text-[10px] tracking-[0.22em] uppercase text-luxury-silver hover:text-luxury-platinum transition-colors duration-300 no-underline"
    >
      {link.label}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
        style={{ background: accentColor }}
      />
    </Link>
  );
}
