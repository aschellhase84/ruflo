'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { RevealText } from '@/components/ui/reveal-text';
import { quote } from '@/data/trip-data';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { imageSizes } from '@/lib/utils';

/**
 * Ruhiger Vollflächen-Abschnitt mit dem großen Zitat.
 * Im Hintergrund ein stark abgedunkeltes Bild in sehr langsamer Bewegung.
 */
export function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const backdropScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.16, 1.1]);

  return (
    <section
      ref={ref}
      aria-label="Zitat"
      className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-ink-950 py-28 sm:py-36"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={
          reduced
            ? undefined
            : { y: backdropY, scale: backdropScale, willChange: 'transform' }
        }
      >
        {/* ERSETZEN: quote.image — sehr ruhiges Motiv, läuft stark abgedunkelt */}
        <Photo image={quote.image} sizes={imageSizes.full} quality={70} />
      </motion.div>

      {/* Weicher Farbverlauf über dem Bild */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ink-950/78"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(188,107,62,0.18),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-5xl px-6 text-center sm:px-8">
        <Reveal variant="fade" duration={1.2}>
          <span
            aria-hidden="true"
            className="mx-auto block font-display text-6xl leading-none text-terracotta-400/50 sm:text-7xl"
          >
            &ldquo;
          </span>
        </Reveal>

        <RevealText
          as="blockquote"
          text={quote.text}
          gap={0.045}
          delay={0.12}
          className="display-md mt-6 font-display italic text-offwhite"
        />

        <Reveal variant="up" delay={0.35} duration={1}>
          <p className="eyebrow mt-10 text-sand-300/70">{quote.attribution}</p>
        </Reveal>
      </div>
    </section>
  );
}
