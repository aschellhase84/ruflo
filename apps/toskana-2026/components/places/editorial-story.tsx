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
 * Layout „Editorial“ (Siena).
 *
 * Asymmetrisches Raster im Stil einer Magazindoppelseite: Titelbild links
 * angeschnitten, Text in einer schmalen Spalte, Detailbilder versetzt.
 */
export function EditorialStory({ place }: { place: Place }) {
  const [detailPortrait, detailWide, detailSquare] = place.gallery;

  return (
    <article
      aria-labelledby={`ort-${place.id}-title`}
      className="relative bg-sand-100 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Explizite Spalten- und Zeilenpositionen: Das Raster ist bewusst
            asymmetrisch, soll aber nicht von der Auto-Platzierung abhängen. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16">
          {/* Großes Titelbild, links über den Rand hinaus */}
          <Reveal
            variant="left"
            duration={1.1}
            className="lg:col-start-1 lg:col-span-8 lg:row-start-1 lg:-ml-12 xl:-ml-24"
          >
            <ParallaxImage
              image={place.hero}
              sizes={imageSizes.half}
              strength={11}
              className="aspect-[4/3] rounded-[2rem] lg:rounded-l-none lg:rounded-r-[2.5rem]"
            />
          </Reveal>

          {/* Textspalte, unten am Titelbild ausgerichtet */}
          <div className="lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:self-end lg:pb-4">
            <PlaceTitle place={place} />

            <Reveal variant="up" delay={0.14}>
              <p className="mt-6 max-w-prose text-base font-light leading-relaxed text-ink-400">
                {place.description}
              </p>
            </Reveal>
          </div>

          {/* Versetzte Detailbilder */}
          <Reveal
            variant="up"
            duration={1}
            className="lg:col-start-2 lg:col-span-4 lg:row-start-2"
          >
            <figure>
              <ParallaxImage
                image={detailPortrait}
                sizes={imageSizes.third}
                strength={14}
                className="aspect-[4/5] rounded-[1.5rem]"
              />
              <Caption text={detailPortrait.alt} />
            </figure>
          </Reveal>

          <Reveal
            variant="up"
            delay={0.12}
            duration={1}
            className="lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:mt-24"
          >
            <figure>
              <ParallaxImage
                image={detailWide}
                sizes={imageSizes.half}
                strength={9}
                className="aspect-[7/5] rounded-[1.5rem]"
              />
              <Caption text={detailWide.alt} />
            </figure>
          </Reveal>

          {/* Rundes Detailbild neben dem hervorgehobenen Satz */}
          <Reveal
            variant="scale"
            delay={0.2}
            duration={1}
            className="mx-auto w-2/3 sm:w-1/2 lg:col-start-2 lg:col-span-3 lg:row-start-3 lg:mx-0 lg:w-full"
          >
            <ParallaxImage
              image={detailSquare}
              sizes={imageSizes.third}
              strength={16}
              className="aspect-square rounded-full"
            />
          </Reveal>

          <div className="lg:col-start-6 lg:col-span-6 lg:row-start-3 lg:self-center">
            <PlaceHighlight place={place} />
            <div className="hairline my-8" aria-hidden="true" />
            <PlaceFacts place={place} />
          </div>
        </div>
      </div>
    </article>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <figcaption className="mt-3 text-xs font-light text-ink-400">
      {text}
    </figcaption>
  );
}
