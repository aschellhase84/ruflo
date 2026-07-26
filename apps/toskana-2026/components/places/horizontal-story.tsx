'use client';

import {
  PlaceFacts,
  PlaceHighlight,
  PlaceTitle,
} from '@/components/places/place-chrome';
import { ParallaxImage } from '@/components/ui/parallax-image';
import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { ScrollRow } from '@/components/ui/scroll-row';
import type { Place } from '@/data/trip-data';
import { imageSizes } from '@/lib/utils';

/**
 * Layout „Horizontal“ (Florenz).
 *
 * Unter dem Titelbild läuft ein horizontaler Bildstreifen. Auf Mobile per
 * Swipe bedienbar (Scroll-Snap), auf Desktop zusätzlich mit Pfeiltasten
 * und Schaltflächen.
 */
export function HorizontalStory({ place }: { place: Place }) {
  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative overflow-hidden bg-offwhite py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-5">
            <PlaceTitle place={place} />
            <Reveal variant="up" delay={0.14}>
              <p className="mt-7 max-w-prose text-base font-light leading-relaxed text-ink-400">
                {place.description}
              </p>
            </Reveal>
            <PlaceHighlight place={place} className="mt-8" />
          </div>

          <Reveal variant="right" duration={1.1} className="lg:col-span-7">
            <ParallaxImage
              image={place.hero}
              sizes={imageSizes.half}
              strength={10}
              className="aspect-[16/10] rounded-[2rem]"
            />
          </Reveal>
        </div>
      </div>

      {/* Horizontaler Bildstreifen — läuft bewusst bis an den Rand */}
      <ScrollRow
        label={`Bilderstrecke ${place.name}`}
        className="mt-14 sm:mt-20"
        controlsClassName="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        {place.gallery.map((image, index) => (
          <figure
            key={image.src}
            className="w-[76vw] shrink-0 snap-start sm:w-[52vw] lg:w-[34vw] xl:w-[30vw]"
          >
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Photo
                image={image}
                sizes={imageSizes.card}
                className="transition-transform duration-[900ms] ease-cinema group-hover:scale-[1.06]"
              />
            </div>
            <figcaption className="mt-3 flex gap-3 text-xs font-light text-ink-400">
              <span className="eyebrow text-sand-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              {image.alt}
            </figcaption>
          </figure>
        ))}
      </ScrollRow>

      <div className="mx-auto mt-14 max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="hairline mb-8" aria-hidden="true" />
        <PlaceFacts place={place} />
      </div>
    </article>
  );
}
