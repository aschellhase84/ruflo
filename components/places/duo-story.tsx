'use client';

import { motion, useTransform } from 'framer-motion';

import {
  PlaceFacts,
  PlaceHighlight,
  PlaceTitle,
} from '@/components/places/place-chrome';
import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import type { Place, TripImage } from '@/data/trip-data';
import { useMouseParallax } from '@/hooks/use-mouse-parallax';
import { imageSizes } from '@/lib/utils';

/**
 * Layout „Duo“ (Montepulciano).
 *
 * Zwei Hochformate, die sich auf dem Desktop leicht gegenläufig zur Maus
 * bewegen (Mouse-Parallax). Auf Touch-Geräten bleibt alles ruhig stehen.
 */
export function DuoStory({ place }: { place: Place }) {
  const { onPointerMove, onPointerLeave, x, y, enabled } = useMouseParallax();

  // Gegenläufige Bewegung erzeugt räumliche Tiefe.
  const leftX = useTransform(x, [-1, 1], [-18, 18]);
  const leftY = useTransform(y, [-1, 1], [-12, 12]);
  const rightX = useTransform(x, [-1, 1], [14, -14]);
  const rightY = useTransform(y, [-1, 1], [10, -10]);
  const heroX = useTransform(x, [-1, 1], [8, -8]);

  const [left, right] = place.gallery;

  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative bg-sand-100 py-20 sm:py-28 lg:py-36"
    >
      <div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        onPointerMove={enabled ? onPointerMove : undefined}
        onPointerLeave={enabled ? onPointerLeave : undefined}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Bildpaar */}
          <div className="lg:col-span-7 lg:order-2">
            <div className="grid grid-cols-2 gap-5 sm:gap-8">
              <Reveal variant="up" duration={1}>
                <motion.div
                  style={enabled ? { x: leftX, y: leftY } : undefined}
                  className="sm:mt-12"
                >
                  <DuoFigure image={left} />
                </motion.div>
              </Reveal>

              <Reveal variant="up" delay={0.16} duration={1}>
                <motion.div style={enabled ? { x: rightX, y: rightY } : undefined}>
                  <DuoFigure image={right} />
                </motion.div>
              </Reveal>
            </div>

            <Reveal variant="scale" delay={0.28} duration={1.1} className="mt-8">
              <motion.div style={enabled ? { x: heroX } : undefined}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] shadow-[0_36px_80px_-52px_rgba(20,20,18,0.7)]">
                  <Photo image={place.hero} sizes={imageSizes.half} />
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 lg:order-1">
            <PlaceTitle place={place} />
            <Reveal variant="up" delay={0.14}>
              <p className="mt-7 max-w-prose text-base font-light leading-relaxed text-ink-400">
                {place.description}
              </p>
            </Reveal>
            <PlaceHighlight place={place} className="mt-8" />
            <PlaceFacts place={place} layout="column" className="mt-10" />
          </div>
        </div>
      </div>
    </article>
  );
}

function DuoFigure({ image }: { image: TripImage }) {
  return (
    <figure className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-[0_30px_70px_-45px_rgba(20,20,18,0.65)]">
        <Photo
          image={image}
          sizes={imageSizes.third}
          className="transition-transform duration-[900ms] ease-cinema group-hover:scale-[1.06]"
        />
      </div>
      <figcaption className="mt-3 text-xs font-light text-ink-400">
        {image.alt}
      </figcaption>
    </figure>
  );
}
