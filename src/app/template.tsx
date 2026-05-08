"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Next.js template.tsx re-mounts on every navigation (unlike layout.tsx).
 * This gives us a clean mount-based enter animation without needing
 * AnimatePresence — each new page instance fades in from its own lifecycle.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
