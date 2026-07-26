import {
  PlaceFacts,
  PlaceHighlight,
  PlaceTitle,
} from '@/components/places/place-chrome';
import { ParallaxImage } from '@/components/ui/parallax-image';
import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import type { Place, TripImage } from '@/data/trip-data';
import { cn, imageSizes } from '@/lib/utils';

/**
 * Layout „Stack“ (San Gimignano).
 *
 * Gestapelte, leicht versetzte Karten mit Hover-Tilt auf Desktop.
 * Der Text sitzt in der Mitte zwischen den Bildern.
 */
export function StackStory({ place }: { place: Place }) {
  const [first, second, third] = place.gallery;

  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative bg-ink-900 py-20 text-offwhite sm:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_10%,rgba(205,186,155,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal variant="scale" duration={1.15}>
          <ParallaxImage
            image={place.hero}
            sizes={imageSizes.full}
            strength={9}
            className="aspect-[16/11] rounded-[2rem] sm:aspect-[21/9]"
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <PlaceTitle place={place} tone="light" />
            <Reveal variant="up" delay={0.14}>
              <p className="mt-7 max-w-prose text-base font-light leading-relaxed text-sand-200/75">
                {place.description}
              </p>
            </Reveal>
            <PlaceHighlight place={place} tone="light" className="mt-8" />
            <PlaceFacts
              place={place}
              tone="light"
              layout="column"
              className="mt-10"
            />
          </div>

          {/* Versetzter Kartenstapel */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-5 sm:gap-8">
              <Reveal variant="up" duration={1} className="col-span-1">
                <TiltCard>
                  <StackCard image={first} />
                </TiltCard>
              </Reveal>

              <Reveal
                variant="up"
                delay={0.14}
                duration={1}
                className="col-span-1 mt-10 sm:mt-16"
              >
                <TiltCard>
                  <StackCard image={third} />
                </TiltCard>
              </Reveal>

              <Reveal
                variant="scale"
                delay={0.24}
                duration={1}
                className="col-span-2 -mt-2 sm:-mt-4"
              >
                <TiltCard max={3}>
                  <StackCard image={second} wide />
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function StackCard({ image, wide = false }: { image: TripImage; wide?: boolean }) {
  return (
    <figure className="group">
      <div
        className={cn(
          'relative overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_40px_90px_-55px_rgba(0,0,0,0.9)]',
          wide ? 'aspect-[16/9]' : 'aspect-[4/5]',
        )}
      >
        <Photo
          image={image}
          sizes={wide ? imageSizes.half : imageSizes.third}
          className="transition-transform duration-[900ms] ease-cinema group-hover:scale-[1.05]"
        />
      </div>
      <figcaption className="mt-3 text-xs font-light text-sand-200/60">
        {image.alt}
      </figcaption>
    </figure>
  );
}
