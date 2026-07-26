'use client';

import { motion, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

import { useMouseParallax } from '@/hooks/use-mouse-parallax';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximaler Neigungswinkel in Grad. */
  max?: number;
}

/**
 * Karte mit dezentem Hover-Tilt (nur Desktop mit feinem Zeiger).
 *
 * Auf Touch-Geräten und bei `prefers-reduced-motion` liefert
 * `useMouseParallax` `enabled: false` — dann wird nichts gerechnet und
 * nichts bewegt.
 */
export function TiltCard({ children, className, max = 5 }: TiltCardProps) {
  const { onPointerMove, onPointerLeave, x, y, enabled } = useMouseParallax(140);

  const rotateY = useTransform(x, [-1, 1], [-max, max]);
  const rotateX = useTransform(y, [-1, 1], [max, -max]);

  return (
    <motion.div
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? onPointerLeave : undefined}
      style={
        enabled
          ? { rotateX, rotateY, transformPerspective: 1100 }
          : undefined
      }
      className={cn('[transform-style:preserve-3d]', className)}
    >
      {children}
    </motion.div>
  );
}
