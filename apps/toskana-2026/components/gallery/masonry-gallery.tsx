'use client';

import { useCallback, useState } from 'react';

import { ImageLightbox } from '@/components/gallery/image-lightbox';
import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { gallery } from '@/data/trip-data';
import { cn, imageSizes } from '@/lib/utils';

/**
 * Highlights-Galerie im Masonry-Raster.
 *
 * Die Spalten kommen aus CSS `columns` — dadurch behalten die Bilder ihr
 * echtes Seitenverhältnis und es entstehen keine Layout Shifts. Jede Kachel
 * ist ein echter Button und öffnet die Lightbox (auch per Tastatur).
 */
export function MasonryGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const navigate = useCallback((index: number) => setOpenIndex(index), []);

  return (
    <section
      id="highlights"
      aria-labelledby="highlights-title"
      className="relative bg-offwhite py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          chapter={gallery.chapter}
          title={gallery.title}
          titleId="highlights-title"
          lead={gallery.lead}
        />

        <div className="mt-14 columns-1 gap-5 sm:columns-2 sm:mt-20 sm:gap-6 lg:columns-3 lg:gap-8">
          {gallery.items.map((item, index) => (
            <Reveal
              key={item.id}
              variant={index % 4 === 0 ? 'blur' : 'up'}
              delay={(index % 3) * 0.06}
              duration={0.95}
              className="mb-5 break-inside-avoid sm:mb-6 lg:mb-8"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Bild vergrößern: ${item.caption}`}
                className="group block w-full text-left"
              >
                <figure>
                  <div className="relative overflow-hidden rounded-[1.25rem] bg-sand-200">
                    <Photo
                      image={item.image}
                      sizes={imageSizes.third}
                      fill={false}
                      className="transition-transform duration-[1100ms] ease-cinema group-hover:scale-[1.06]"
                    />

                    {/* Sanfter Schleier beim Hover — kein hartes Overlay */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-ink-950/0 transition-colors duration-700 group-hover:bg-ink-950/15"
                    />

                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full',
                        'border border-white/40 bg-white/15 text-offwhite opacity-0 backdrop-blur-md',
                        'translate-y-2 transition-all duration-500 ease-cinema',
                        'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
                      )}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
                      </svg>
                    </span>
                  </div>

                  <figcaption className="mt-3 flex items-baseline gap-3 text-xs font-light text-ink-400">
                    <span className="eyebrow shrink-0 text-sand-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="transition-colors duration-300 group-hover:text-ink-800">
                      {item.caption}
                    </span>
                  </figcaption>
                </figure>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <ImageLightbox
        items={gallery.items}
        index={openIndex}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  );
}
