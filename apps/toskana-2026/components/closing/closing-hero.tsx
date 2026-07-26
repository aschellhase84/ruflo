'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { RevealText } from '@/components/ui/reveal-text';
import { closing } from '@/data/trip-data';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { imageSizes } from '@/lib/utils';

/**
 * Abschlussbild im Vollbildformat mit langsamem Zoom-out.
 * Das Bild startet leicht vergrößert und geht beim Scrollen sanft zurück.
 */
export function ClosingHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.22, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="abschluss-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink-950"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={
          reduced ? undefined : { scale, opacity, willChange: 'transform' }
        }
      >
        {/* ERSETZEN: closing.image in data/trip-data.ts */}
        <Photo image={closing.image} sizes={imageSizes.full} quality={86} />
      </motion.div>

      <div className="scrim absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto w-full max-w-4xl px-6 py-32 text-center sm:px-8">
        <RevealText
          as="h2"
          id="abschluss-title"
          text={closing.title}
          gap={0.11}
          className="display-lg font-display text-offwhite"
        />

        <Reveal variant="up" delay={0.3} duration={1.1}>
          <p className="lede mx-auto mt-8 max-w-xl font-light text-sand-100/85">
            {closing.subtitle}
          </p>
        </Reveal>

        <Reveal variant="fade" delay={0.55} duration={1.2}>
          <div className="mt-12 flex items-center justify-center gap-5">
            <span className="h-px w-12 bg-sand-300/35" aria-hidden="true" />
            <span className="eyebrow text-sand-300/70">{closing.note}</span>
            <span className="h-px w-12 bg-sand-300/35" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
