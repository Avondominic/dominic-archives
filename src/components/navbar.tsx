"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useLenis } from "@/components/providers/lenis-provider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/** Scroll to #showcase via Lenis, or navigate home first then scroll. */
function useScrollToShowcase() {
  const lenis    = useLenis();
  const router   = useRouter();
  const pathname = usePathname();

  return () => {
    if (pathname === "/") {
      lenis?.scrollTo("#showcase", { offset: 0, duration: 1.6 });
    } else {
      router.push("/#showcase");
    }
  };
}

/* ─── main navbar ─────────────────────────────────────────────────────────── */

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [hidden, setHidden]       = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const lastScrollY               = useRef(0);
  const { scrollY }               = useScroll();
  const scrollToShowcase          = useScrollToShowcase();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    setHidden(latest > 80 && diff > 0);
    setScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  // Close menu on route change
  const pathname = usePathname();
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-110%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <motion.div
          animate={{
            paddingTop:    scrolled ? "0.875rem" : "1.25rem",
            paddingBottom: scrolled ? "0.875rem" : "1.25rem",
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`glass-navbar transition-shadow duration-500 ${
            scrolled ? "shadow-[0_1px_40px_rgba(0,0,0,0.4)]" : ""
          }`}
        >
          <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">

            {/* ── Logo ── */}
            <DominicLogo />

            {/* ── Desktop links ── */}
            <ul className="hidden md:flex items-center gap-8 list-none">
              <li>
                <NavBtn onClick={scrollToShowcase}>Explore</NavBtn>
              </li>
              <li>
                <NavBtn onClick={() => setAboutOpen(true)}>About</NavBtn>
              </li>
              <li>
                <NavBtn onClick={scrollToShowcase}>All Anime</NavBtn>
              </li>
            </ul>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 z-[110]"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1px] bg-luxury-platinum origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-3 h-[1px] bg-luxury-accent origin-center"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1px] bg-luxury-platinum origin-center"
              />
            </button>
          </nav>
        </motion.div>

        {/* Gold underline on scroll */}
        <motion.div
          animate={{ opacity: scrolled ? 0.15 : 0 }}
          transition={{ duration: 0.4 }}
          className="h-[1px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8D5A3 50%, #C9A84C 70%, transparent 100%)",
          }}
        />
      </motion.header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center"
            style={{ background: "rgba(6,6,10,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center gap-10 list-none">
              {[
                { label: "Explore",   action: () => { setMenuOpen(false); scrollToShowcase(); } },
                { label: "About",     action: () => { setMenuOpen(false); setAboutOpen(true); } },
                { label: "All Anime", action: () => { setMenuOpen(false); scrollToShowcase(); } },
              ].map(({ label, action }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                >
                  <button
                    onClick={action}
                    className="font-display uppercase text-luxury-platinum tracking-[0.25em] hover:text-luxury-accent transition-colors duration-300"
                    style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── About overlay ── */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            key="about-overlay"
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{ background: "rgba(6,6,10,0.85)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setAboutOpen(false)}
          >
            <motion.div
              className="relative max-w-xl w-full p-10 md:p-14"
              style={{
                background: "rgba(14,14,20,0.72)",
                border: "1px solid rgba(201,168,76,0.18)",
                boxShadow: "0 0 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner ornaments */}
              {(["tl","tr","bl","br"] as const).map((p) => (
                <div
                  key={p}
                  className={`absolute w-5 h-5 ${p[0]==="t"?"top-4":"bottom-4"} ${p[1]==="l"?"left-4":"right-4"}`}
                  style={{
                    borderTop:    p[0]==="t" ? "1px solid rgba(201,168,76,0.4)" : undefined,
                    borderBottom: p[0]==="b" ? "1px solid rgba(201,168,76,0.4)" : undefined,
                    borderLeft:   p[1]==="l" ? "1px solid rgba(201,168,76,0.4)" : undefined,
                    borderRight:  p[1]==="r" ? "1px solid rgba(201,168,76,0.4)" : undefined,
                  }}
                />
              ))}

              {/* Content */}
              <p className="font-body text-[10px] tracking-[0.5em] uppercase text-luxury-accent mb-6 opacity-80">
                About this archive
              </p>

              <h2
                className="font-display uppercase text-luxury-platinum leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#ffffff" }}
              >
                Built for anime lovers.
                <br />
                <span style={{ color: "#C9A84C" }}>Crafted for cinema.</span>
              </h2>

              <p className="font-body text-luxury-silver leading-[1.85] mb-6" style={{ fontSize: "1rem" }}>
                Dominic Archives is a cinematic showcase of the greatest anime ever made —
                presented with the craft and weight each story deserves.
              </p>

              <p className="font-body text-luxury-silver/60 leading-[1.8]" style={{ fontSize: "0.9rem" }}>
                No clutter. No noise. Just the stories, the characters, and the worlds
                that defined a generation — rendered in dark luxury.
              </p>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.25)" }} />
                <span
                  className="font-body text-[9px] tracking-[0.45em] uppercase"
                  style={{ color: "rgba(201,168,76,0.6)" }}
                >
                  支配者の記録
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.25)" }} />
              </div>

              <button
                onClick={() => setAboutOpen(false)}
                className="mt-8 w-full font-body text-[10px] tracking-[0.4em] uppercase text-luxury-silver/40 hover:text-luxury-silver transition-colors duration-300"
              >
                Click anywhere to close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── nav button ──────────────────────────────────────────────────────────── */

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="relative font-body text-xs tracking-[0.2em] uppercase text-luxury-silver hover:text-luxury-platinum transition-colors duration-300 group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-luxury-accent transition-all duration-300 group-hover:w-full" />
    </button>
  );
}

/* ─── Dominic Archives logo with ink brush reveal ────────────────────────── */

function DominicLogo() {
  const [revealed, setRevealed] = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const router                  = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(t);
  }, []);

  const showJapanese = revealed || hovered;

  return (
    <button
      onClick={() => router.push("/")}
      className="flex flex-col items-start no-underline select-none cursor-pointer"
      aria-label="Dominic Archives — home"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="font-display uppercase text-luxury-platinum leading-none tracking-[0.18em]"
        style={{ fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)", color: "#ffffff" }}
      >
        Dominic Archives
      </span>

      <div className="relative h-5 overflow-hidden mt-0.5">
        <AnimatePresence>
          {showJapanese && (
            <motion.span
              key="jp"
              className="block leading-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-yuji), serif",
                fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)",
                color: "rgba(255,255,255,0.75)",
                textShadow:
                  "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2), 1px 0 4px rgba(255,255,255,0.15), -1px 0 4px rgba(255,255,255,0.15)",
              }}
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.6, filter: "blur(3px)" }}
              animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1, filter: "blur(0.4px)" }}
              exit={{ clipPath: "inset(0 100% 0 0)", opacity: 0, filter: "blur(3px)" }}
              transition={{
                clipPath: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                opacity:  { duration: 0.3 },
                filter:   { duration: 1.4, ease: "easeOut" },
              }}
            >
              支配者の記録
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="h-px mt-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 70%, transparent 100%)",
          filter: "blur(0.5px)",
        }}
        initial={{ width: 0 }}
        animate={{ width: showJapanese ? "100%" : "35%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
    </button>
  );
}
