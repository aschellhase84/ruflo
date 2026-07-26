import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { culinary } from '@/data/trip-data';
import { cn, imageSizes } from '@/lib/utils';

/**
 * Kulinarik als asymmetrisches Raster.
 *
 * Die Flächenaufteilung kommt pro Eintrag aus `data/trip-data.ts` (`span`),
 * damit neue Bilder ohne Eingriff in die Komponente ergänzt werden können.
 */
export function CulinaryGrid() {
  return (
    <section
      id="genuss"
      aria-labelledby="genuss-title"
      className="grain relative overflow-hidden bg-sand-100 py-24 sm:py-32 lg:py-40"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          chapter={culinary.chapter}
          title={culinary.title}
          titleId="genuss-title"
          lead={culinary.lead}
        />

        <div className="mt-14 grid auto-rows-[minmax(0,auto)] gap-5 sm:mt-20 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          {culinary.items.map((item, index) => (
            <Reveal
              key={item.id}
              variant={index % 3 === 0 ? 'scale' : 'up'}
              delay={(index % 3) * 0.08}
              duration={1}
              className={cn('min-w-0', item.span)}
            >
              <figure className="group h-full">
                <div
                  className={cn(
                    'relative h-full overflow-hidden rounded-[1.5rem] bg-sand-200',
                    // Große Kacheln bekommen ein ruhigeres Format
                    item.span.includes('row-span-2')
                      ? 'aspect-[4/5] sm:aspect-[16/13] lg:aspect-auto lg:min-h-[30rem]'
                      : 'aspect-[4/3]',
                  )}
                >
                  <Photo
                    image={item.image}
                    sizes={
                      item.span.includes('col-span-7')
                        ? imageSizes.half
                        : imageSizes.third
                    }
                    className="transition-transform duration-[1100ms] ease-cinema group-hover:scale-[1.07]"
                  />

                  {/* Verlauf nur unten — der Text bleibt immer lesbar */}
                  <div
                    className="scrim-soft absolute inset-0 opacity-90 transition-opacity duration-700 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <h3 className="font-display text-xl leading-tight text-offwhite sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-sand-200/85 transition-transform duration-700 ease-cinema sm:translate-y-1 sm:opacity-80 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      {item.note}
                    </p>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
