'use client';

import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import { MOTION_TAGS, type MotionTag } from '@/components/ui/motion-tags';
import { cn } from '@/lib/utils';

export type RevealVariant = 'fade' | 'up' | 'left' | 'right' | 'scale' | 'blur';

const VARIANTS: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  up: {
    hidden: { opacity: 0, y: 44 },
    shown: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -56 },
    shown: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 56 },
    shown: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    shown: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(14px)', y: 20 },
    shown: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
};

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Verzögerung in Sekunden. */
  delay?: number;
  duration?: number;
  className?: string;
  as?: MotionTag;
}

/**
 * Scroll-Reveal-Baustein: Fade, Slide, Scale und Blur-In.
 *
 * Bei `prefers-reduced-motion` reduziert Framer Motion über
 * `<MotionConfig reducedMotion="user">` (siehe app/page.tsx) automatisch auf
 * eine reine Deckkraft-Änderung — es bewegt sich dann nichts mehr.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.85,
  className,
  as = 'div',
}: RevealProps) {
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={cn(className)}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Abstand zwischen den Kindern in Sekunden. */
  gap?: number;
  delay?: number;
  as?: MotionTag;
}

/** Container, der seine `StaggerItem`-Kinder nacheinander einblendet. */
export function Stagger({
  children,
  className,
  gap = 0.09,
  delay = 0,
  as = 'div',
}: StaggerProps) {
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </Tag>
  );
}

/** Kind eines `Stagger`-Containers. */
export function StaggerItem({
  children,
  variant = 'up',
  className,
  duration = 0.8,
  as = 'div',
}: Omit<RevealProps, 'delay'>) {
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={cn(className)}
      variants={VARIANTS[variant]}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
