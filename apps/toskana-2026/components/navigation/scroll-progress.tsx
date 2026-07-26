'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Feine Fortschrittsleiste am oberen Bildschirmrand.
 *
 * `scaleX` läuft komplett im Compositor — kein Re-Render, kein Layout.
 * Die Leiste ist rein dekorativ und daher vor Screenreadern versteckt.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-terracotta-500 via-terracotta-400 to-olive-400"
    />
  );
}
