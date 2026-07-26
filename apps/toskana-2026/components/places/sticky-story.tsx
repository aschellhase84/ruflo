'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

import {
  PlaceFacts,
  PlaceHighlight,
  PlaceTitle,
} from '@/components/places/place-chrome';
import { ParallaxImage } from '@/components/ui/parallax-image';
import { Reveal } from '@/components/ui/reveal';
import type { Place } from '@/data/trip-data';
import { imageSizes } from '@/lib/utils';

/**
 * Layout „Sticky Story“ (Rabi).
 *
 * Der Textblock bleibt beim Scrollen stehen, während die Bilder daneben
 * durchlaufen. Ein Zähler in der Textspalte zeigt, bei welchem Bild man ist.
 * Auf Mobile stapelt alles ganz normal untereinander.
 */
export function StickyStory({ place }: { place: Place }) {
  const imagesRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const total = place.gallery.length;

  const { scrollYProgress } = useScroll({
    target: imagesRef,
    offset: ['start 60%', 'end 90%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(total, Math.max(1, Math.ceil(value * total) || 1));
    setCurrent((previous) => (previous === next ? previous : next));
  });

  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative bg-offwhite py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Titelbild über die volle Breite */}
        <Reveal variant="scale" duration={1.1}>
          <ParallaxImage
            image={place.hero}
            sizes={imageSizes.full}
            strength={10}
            className="aspect-[16/10] rounded-[2rem] sm:aspect-[16/8]"
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Sticky-Textspalte */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <PlaceTitle place={place} />

              <Reveal variant="up" delay={0.14}>
                <p className="mt-7 max-w-prose text-base font-light leading-relaxed text-ink-400">
                  {place.description}
                </p>
              </Reveal>

              <PlaceHighlight place={place} className="mt-8" />
              <PlaceFacts place={place} className="mt-10" />

              {/* Bildzähler — läuft mit der Bildspalte mit */}
              <div
                aria-hidden="true"
                className="mt-10 hidden items-center gap-4 lg:flex"
              >
                <span className="font-display text-3xl text-ink-800">
                  <motion.span key={current} className="inline-block">
                    {String(current).padStart(2, '0')}
                  </motion.span>
                </span>
                <span className="h-px flex-1 bg-sand-300">
                  <motion.span
                    className="block h-px origin-left bg-terracotta-500"
                    style={{ scaleX: scrollYProgress }}
                  />
                </span>
                <span className="eyebrow text-sand-600">
                  {String(total).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollende Bildspalte */}
          <div
            ref={imagesRef}
            className="flex flex-col gap-6 sm:gap-10 lg:col-span-7"
          >
            {place.gallery.map((image, index) => (
              <Reveal
                key={image.src}
                variant={index % 2 === 0 ? 'right' : 'up'}
                duration={1}
                className={index % 2 === 1 ? 'lg:pl-16' : 'lg:pr-8'}
              >
                <figure>
                  <ParallaxImage
                    image={image}
                    sizes={imageSizes.half}
                    strength={13}
                    className="aspect-[4/5] rounded-[1.75rem] shadow-[0_36px_80px_-50px_rgba(20,20,18,0.7)]"
                  />
                  <figcaption className="mt-3 text-xs font-light text-ink-400">
                    <span className="eyebrow mr-3 text-sand-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {image.alt}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
