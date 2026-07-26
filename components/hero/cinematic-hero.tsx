'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Photo } from '@/components/ui/photo';
import { RevealText } from '@/components/ui/reveal-text';
import { heroImage, trip } from '@/data/trip-data';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { imageSizes } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Vollbild-Einstieg der Seite.
 *
 * - Langsamer Ken-Burns-Zoom auf dem Hintergrundbild (reine CSS-Animation,
 *   wird bei `prefers-reduced-motion` global deaktiviert)
 * - Zusätzliche Scroll-Parallaxe: Bild wandert langsamer als der Text
 * - Gestaffelter Texteinstieg
 */
export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="beginn"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950"
    >
      {/* Hintergrundbild — ERSETZEN über data/trip-data.ts → heroImage */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduced ? undefined : { y: imageY, willChange: 'transform' }}
      >
        <div className="absolute inset-0 origin-center animate-ken-burns motion-reduce:animate-none">
          <Photo
            image={heroImage}
            sizes={imageSizes.full}
            priority
            quality={88}
          />
        </div>
      </motion.div>

      {/* Dunkler Verlauf für Textkontrast */}
      <div className="scrim absolute inset-0 -z-10" aria-hidden="true" />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-6 pb-24 pt-40 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="eyebrow text-sand-300"
        >
          {trip.kicker}
        </motion.p>

        <RevealText
          as="h1"
          id="hero-title"
          immediate
          delay={0.45}
          gap={0.09}
          text={trip.title}
          className="display-xl mt-6 font-display text-offwhite"
        />

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE }}
            className="lede max-w-xl font-light text-sand-100/90"
          >
            {trip.subtitle}
          </motion.p>

          {/* Dekorative Zusatzinformationen */}
          <motion.dl
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.15, ease: EASE }}
            className="glass-dark flex flex-wrap gap-x-8 gap-y-4 rounded-2xl px-6 py-5 text-offwhite lg:rounded-full lg:px-8"
          >
            <HeroMeta label="Zeitraum" value={trip.period} />
            <HeroMeta label="Region" value={trip.region} />
            <HeroMeta label="Position" value={trip.coordinates} />
          </motion.dl>
        </div>
      </motion.div>

      {/* Scroll-Indikator */}
      <motion.a
        href="#reisebeginn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 text-sand-200/70 transition-colors hover:text-offwhite sm:bottom-8"
      >
        <span className="eyebrow text-[0.5625rem]">Weiterscrollen</span>
        <span
          aria-hidden="true"
          className="flex h-8 w-5 items-start justify-center rounded-full border border-current/50 pt-1.5"
        >
          <span className="block h-1.5 w-px animate-scroll-hint bg-current motion-reduce:animate-none" />
        </span>
        <span className="sr-only">Zum ersten Kapitel springen</span>
      </motion.a>
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-[0.5625rem] text-sand-300/70">{label}</dt>
      <dd className="mt-1.5 whitespace-nowrap text-sm font-light">{value}</dd>
    </div>
  );
}
