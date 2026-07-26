import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { favourites, type FavouriteMoment } from '@/data/trip-data';
import { cn, imageSizes } from '@/lib/utils';

/**
 * Lieblingsmomente als Story-Karten.
 *
 * Vier Kartenvarianten (`variant` in data/trip-data.ts) sorgen dafür, dass
 * sich die Karten optisch klar unterscheiden — breit, hochkant, quadratisch
 * und eine reine Textkarte mit kleinem Bildstreifen.
 */
export function FavouriteMoments() {
  return (
    <section
      aria-labelledby="lieblingsmomente-title"
      className="grain relative overflow-hidden bg-sand-100 py-24 sm:py-32 lg:py-40"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          chapter={favourites.chapter}
          title={favourites.title}
          titleId="lieblingsmomente-title"
          lead={favourites.lead}
        />

        <div className="mt-14 grid gap-6 sm:mt-20 sm:gap-8 lg:grid-cols-12">
          {favourites.items.map((item, index) => {
            // Die letzte Karte läuft über die volle Breite und schließt den
            // Abschnitt ab — sonst bliebe die letzte Rasterzeile halb leer.
            const isLast = index === favourites.items.length - 1;
            return (
              <Reveal
                key={item.id}
                variant={index % 2 === 0 ? 'up' : 'scale'}
                delay={(index % 2) * 0.1}
                duration={1}
                className={cn(
                  'min-w-0',
                  isLast ? 'lg:col-span-12' : SPANS[item.variant],
                )}
              >
                <TiltCard max={isLast ? 2 : 4} className="h-full">
                  <MomentCard item={item} full={isLast} />
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SPANS: Record<FavouriteMoment['variant'], string> = {
  wide: 'lg:col-span-7',
  portrait: 'lg:col-span-5',
  square: 'lg:col-span-4',
  text: 'lg:col-span-8',
};

function MomentCard({
  item,
  full = false,
}: {
  item: FavouriteMoment;
  full?: boolean;
}) {
  // Reine Textkarte mit schmalem Bildstreifen — bewusst anders als der Rest.
  if (item.variant === 'text') {
    return (
      <article className="glass group flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] p-7 sm:flex-row sm:items-center sm:p-9">
        <div className="min-w-0">
          <p className="eyebrow text-terracotta-600">{item.kicker}</p>
          <h3 className="mt-4 font-display text-2xl leading-tight text-ink-800 sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink-400">
            {item.text}
          </p>
        </div>

        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-[3/4] sm:w-40">
          <Photo
            image={item.image}
            sizes="(max-width: 639px) 88vw, 10rem"
            className="transition-transform duration-[1000ms] ease-cinema group-hover:scale-[1.08]"
          />
        </div>
      </article>
    );
  }

  const ratio = full
    ? 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/8]'
    : item.variant === 'wide'
      ? 'aspect-[16/10]'
      : item.variant === 'portrait'
        ? 'aspect-[4/5]'
        : 'aspect-square';

  return (
    <article className="group h-full">
      <div
        className={cn(
          'relative overflow-hidden rounded-[1.75rem] shadow-[0_36px_80px_-52px_rgba(20,20,18,0.65)]',
          ratio,
        )}
      >
        <Photo
          image={item.image}
          sizes={
            full
              ? imageSizes.full
              : item.variant === 'wide'
                ? imageSizes.half
                : imageSizes.third
          }
          className="transition-transform duration-[1100ms] ease-cinema group-hover:scale-[1.06]"
        />
        <div className="scrim absolute inset-0" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="eyebrow text-terracotta-300">{item.kicker}</p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-offwhite sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-sand-200/80">
            {item.text}
          </p>
        </div>
      </div>
    </article>
  );
}
