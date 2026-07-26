import { Reveal, Stagger, StaggerItem } from '@/components/ui/reveal';
import { RevealText } from '@/components/ui/reveal-text';
import type { Place } from '@/data/trip-data';
import { cn } from '@/lib/utils';

interface PlaceTitleProps {
  place: Place;
  tone?: 'dark' | 'light';
  className?: string;
  /** Große Variante für Panorama-Overlays. */
  size?: 'md' | 'lg';
}

/** Kapitelnummer, Ortsname und Region — in allen Ortslayouts identisch. */
export function PlaceTitle({
  place,
  tone = 'dark',
  className,
  size = 'md',
}: PlaceTitleProps) {
  const light = tone === 'light';

  return (
    <div className={cn(className)}>
      <Reveal variant="fade" duration={0.85}>
        <p
          className={cn(
            'eyebrow flex items-center gap-3',
            light ? 'text-sand-300/85' : 'text-terracotta-600',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'font-display text-[2.5rem] leading-none tracking-normal',
              light ? 'text-white/25' : 'text-sand-400/70',
            )}
          >
            {place.chapter}
          </span>
          {place.region}
        </p>
      </Reveal>

      <RevealText
        as="h3"
        id={`ort-${place.id}-title`}
        text={place.name}
        delay={0.08}
        className={cn(
          'mt-4 font-display',
          size === 'lg' ? 'display-lg' : 'display-md',
          light ? 'text-offwhite' : 'text-ink-800',
        )}
      />
    </div>
  );
}

interface PlaceFactsProps {
  place: Place;
  tone?: 'dark' | 'light';
  className?: string;
  /** Nebeneinander statt untereinander. */
  layout?: 'row' | 'column';
}

/** Kleine Fakten und Erinnerungen zum Ort. */
export function PlaceFacts({
  place,
  tone = 'dark',
  className,
  layout = 'row',
}: PlaceFactsProps) {
  const light = tone === 'light';

  return (
    <Stagger
      as="ul"
      gap={0.11}
      className={cn(
        layout === 'row'
          ? 'flex flex-wrap gap-x-10 gap-y-5'
          : 'flex flex-col gap-4',
        className,
      )}
    >
      {place.facts.map((fact) => (
        <StaggerItem as="li" key={fact.label} variant="up">
          <p
            className={cn(
              'eyebrow',
              light ? 'text-sand-300/60' : 'text-sand-600',
            )}
          >
            {fact.label}
          </p>
          <p
            className={cn(
              'mt-1.5 font-display text-lg sm:text-xl',
              light ? 'text-offwhite' : 'text-ink-800',
            )}
          >
            {fact.value}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

interface PlaceHighlightProps {
  place: Place;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Ein hervorgehobener Satz, gesetzt als kursive Serifenzeile. */
export function PlaceHighlight({
  place,
  tone = 'dark',
  className,
}: PlaceHighlightProps) {
  const light = tone === 'light';

  return (
    <Reveal variant="blur" duration={1} className={className}>
      <p
        className={cn(
          'border-l-2 pl-5 font-display text-xl italic leading-relaxed sm:text-2xl',
          light
            ? 'border-terracotta-400/60 text-sand-100'
            : 'border-terracotta-500/60 text-ink-600',
        )}
      >
        {place.highlight}
      </p>
    </Reveal>
  );
}
