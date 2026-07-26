'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { PlaceFacts, PlaceTitle } from '@/components/places/place-chrome';
import { ParallaxImage } from '@/components/ui/parallax-image';
import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import type { Place } from '@/data/trip-data';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { imageSizes } from '@/lib/utils';

/**
 * Layout „Panorama“ (Val d'Orcia).
 *
 * Ein sticky Vollbild-Panorama mit Text-Overlay: Das Bild bleibt stehen,
 * während der Text darüber langsam durchzieht und ausblendet.
 */
export function PanoramaStory({ place }: { place: Place }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);

  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative bg-ink-950"
    >
      {/* Sticky-Panorama: Der äußere Container ist doppelt so hoch wie der
          Bildschirm — dadurch bleibt das Bild eine ganze Bildschirmhöhe stehen. */}
      <div ref={ref} className="relative h-[190svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={
              reduced ? undefined : { scale: imageScale, willChange: 'transform' }
            }
          >
            {/* ERSETZEN: place.hero — großes Panorama, mind. 2200px breit */}
            <Photo image={place.hero} sizes={imageSizes.full} quality={86} />
          </motion.div>

          <div className="scrim absolute inset-0" aria-hidden="true" />

          <motion.div
            style={reduced ? undefined : { y: textY, opacity: textOpacity }}
            className="absolute inset-0 flex items-end"
          >
            <div className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
              <PlaceTitle place={place} tone="light" size="lg" />

              <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
                <Reveal variant="up" delay={0.14} className="lg:col-span-6">
                  <p className="max-w-prose text-base font-light leading-relaxed text-sand-100/85 sm:text-lg">
                    {place.description}
                  </p>
                </Reveal>

                <Reveal
                  variant="blur"
                  delay={0.24}
                  className="lg:col-span-5 lg:col-start-8"
                >
                  <p className="glass-dark rounded-2xl px-6 py-5 font-display text-lg italic leading-relaxed text-offwhite sm:text-xl">
                    {place.highlight}
                  </p>
                </Reveal>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Zwei Detailbilder unterhalb des Panoramas */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
          {place.gallery.map((image, index) => (
            <Reveal
              key={image.src}
              variant={index === 0 ? 'left' : 'right'}
              duration={1}
              className={index === 1 ? 'sm:mt-16' : undefined}
            >
              <figure>
                <ParallaxImage
                  image={image}
                  sizes={imageSizes.half}
                  strength={12}
                  className="aspect-[7/5] rounded-[1.5rem]"
                />
                <figcaption className="mt-3 text-xs font-light text-sand-200/60">
                  {image.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <div className="hairline mb-8 opacity-30" aria-hidden="true" />
          <PlaceFacts place={place} tone="light" />
        </div>
      </div>
    </article>
  );
}
