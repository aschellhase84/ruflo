'use client';

import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

import { usePointerFine, useReducedMotion } from './use-reduced-motion';

interface MouseParallaxResult {
  /** Auf das Container-Element legen. */
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  /** −1 … 1, relativ zur Elementmitte. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** False auf Touch-Geräten oder bei prefers-reduced-motion. */
  enabled: boolean;
}

/**
 * Maus-Parallax für Desktop. Auf Touch-Geräten und bei reduzierter
 * Bewegung liefert der Hook konstante Nullwerte — es werden dann weder
 * Events noch Springs ausgewertet.
 */
export function useMouseParallax(stiffness = 90): MouseParallaxResult {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const enabled = fine && !reduced;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness, damping: 22, mass: 0.4 });

  // Rect nur beim Eintritt messen, nicht bei jedem Move → kein Layout-Thrashing.
  const rect = useRef<DOMRect | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      if (!rect.current) rect.current = event.currentTarget.getBoundingClientRect();
      const box = rect.current;
      rawX.set(((event.clientX - box.left) / box.width - 0.5) * 2);
      rawY.set(((event.clientY - box.top) / box.height - 0.5) * 2);
    },
    [enabled, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    rect.current = null;
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { onPointerMove, onPointerLeave, x, y, enabled };
}
