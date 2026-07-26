'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { timeline } from '@/data/trip-data';
import { cn, imageSizes } from '@/lib/utils';

/**
 * Reiseroute als Zeitstrahl.
 *
 * - Mobile/Tablet: vertikale Timeline, Linie wächst beim Scrollen mit
 * - Desktop (xl): horizontale Timeline, Stationen abwechselnd über/unter
 *   der Linie, ebenfalls scroll-gebunden
 *
 * Beide Varianten teilen sich dieselben Daten (data/trip-data.ts → timeline);
 * pro Station lassen sich Datum, Notiz und Bild frei pflegen.
 */
export function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 60%'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="route"
      aria-labelledby="route-title"
      className="relative overflow-hidden bg-ink-900 py-24 text-offwhite sm:py-32 lg:py-40"
    >
      {/* Sehr dezenter Farbschleier, damit die Fläche nicht flach wirkt */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(188,107,62,0.16),transparent_60%),radial-gradient(60%_50%_at_90%_100%,rgba(111,124,85,0.16),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          chapter="Kapitel 02"
          title="Die Route"
          titleId="route-title"
          tone="light"
          lead="Neun Stationen, zwei Wochen und ziemlich viele Kilometer — hier die Reise in ihrer Reihenfolge."
        />

        <div ref={ref} className="mt-16 sm:mt-20 lg:mt-24">
          {/* ---------- Vertikale Timeline (bis xl) ---------- */}
          <ol className="relative xl:hidden">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[7px] top-2 w-px bg-white/12"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: lineScale }}
              className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-terracotta-400 to-olive-400"
            />

            {timeline.map((stop, index) => (
              <li key={stop.id} className="relative pb-12 pl-10 last:pb-0">
                <Reveal variant="up" duration={0.75}>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-white/25 bg-ink-900"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-terracotta-400" />
                  </span>

                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-terracotta-300">
                        {String(index + 1).padStart(2, '0')}
                        <span className="mx-2 text-white/25">·</span>
                        {stop.date}
                      </p>
                      <h3 className="mt-2 font-display text-2xl text-offwhite sm:text-3xl">
                        {stop.place}
                      </h3>
                      <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-sand-200/70">
                        {stop.note}
                      </p>
                    </div>

                    <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:w-32">
                      <Photo image={stop.image} sizes={imageSizes.thumb} />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* ---------- Horizontale Timeline (ab xl) ---------- */}
          <div className="hidden xl:block">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/12"
              />
              <motion.span
                aria-hidden="true"
                style={{ scaleX: lineScale }}
                className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-terracotta-400 to-olive-400"
              />

              {/* Feste Höhe: Die Achse liegt exakt bei 50 %, Stationen sitzen
                  abwechselnd komplett darüber bzw. darunter. */}
              <ol className="relative grid h-[40rem] grid-cols-9">
                {timeline.map((stop, index) => {
                  const above = index % 2 === 0;
                  return (
                    <li key={stop.id} className="relative px-2">
                      <Reveal
                        variant={above ? 'up' : 'fade'}
                        delay={index * 0.04}
                        duration={0.8}
                        className={cn(
                          'absolute inset-x-2',
                          above
                            ? 'bottom-1/2 mb-7 flex flex-col justify-end'
                            : 'top-1/2 mt-7',
                        )}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                          <Photo image={stop.image} sizes="12vw" />
                          <div
                            className="scrim-soft absolute inset-0"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="eyebrow mt-3.5 text-terracotta-300">
                          {stop.date}
                        </p>
                        <h3 className="mt-1.5 font-display text-lg leading-tight text-offwhite">
                          {stop.place}
                        </h3>
                        <p className="mt-1.5 text-[0.8125rem] font-light leading-snug text-sand-200/65">
                          {stop.note}
                        </p>
                      </Reveal>

                      {/* Verbindungsstrich zwischen Achse und Station */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-1/2 h-7 w-px -translate-x-1/2 bg-white/20',
                          above ? 'bottom-1/2' : 'top-1/2',
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-ink-900"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-terracotta-400" />
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
