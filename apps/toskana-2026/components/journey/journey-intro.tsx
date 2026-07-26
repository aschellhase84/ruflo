import { ParallaxImage } from '@/components/ui/parallax-image';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { journey } from '@/data/trip-data';
import { imageSizes } from '@/lib/utils';

/**
 * Heller, großzügiger Einstiegsabschnitt nach dem Hero.
 * Zwei große Bildflächen, animierte Zeitachse, viel Weißraum.
 */
export function JourneyIntro() {
  return (
    <section
      id="reisebeginn"
      aria-labelledby="reisebeginn-title"
      className="grain relative overflow-hidden bg-offwhite py-24 sm:py-32 lg:py-44"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              chapter={journey.chapter}
              title={journey.title}
              titleId="reisebeginn-title"
              lead={journey.lead}
            />

            <Reveal variant="up" delay={0.22}>
              <p className="mt-7 max-w-prose text-base font-light leading-relaxed text-ink-400">
                {journey.text}
              </p>
            </Reveal>

            {/* Animierte Linie mit Eckdaten */}
            <Reveal variant="fade" delay={0.3} className="mt-12">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full bg-sand-300"
                />
                <Stagger
                  as="ul"
                  gap={0.13}
                  className="grid grid-cols-3 gap-4 pt-6"
                >
                  {journey.milestones.map((milestone) => (
                    <StaggerItem
                      as="li"
                      key={milestone.label}
                      variant="up"
                      className="relative"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-6 left-0 h-2 w-px bg-terracotta-500"
                      />
                      <p className="eyebrow text-sand-600">{milestone.label}</p>
                      <p className="mt-2 font-display text-lg text-ink-800 sm:text-xl">
                        {milestone.value}
                      </p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          </div>

          {/* Zwei große Bildflächen, bewusst versetzt */}
          <div className="lg:col-span-6">
            <div className="grid gap-6 sm:grid-cols-5 sm:gap-8">
              <Reveal variant="scale" duration={1.05} className="sm:col-span-3">
                {/* ERSETZEN: journey.imagePortrait in data/trip-data.ts */}
                <ParallaxImage
                  image={journey.imagePortrait}
                  sizes={imageSizes.third}
                  strength={9}
                  className="aspect-[3/4] rounded-[1.75rem] shadow-[0_30px_70px_-40px_rgba(20,20,18,0.6)]"
                />
              </Reveal>

              <Reveal
                variant="scale"
                delay={0.18}
                duration={1.05}
                className="sm:col-span-2 sm:mt-28"
              >
                {/* ERSETZEN: journey.imageWide in data/trip-data.ts */}
                <ParallaxImage
                  image={journey.imageWide}
                  sizes={imageSizes.third}
                  strength={14}
                  className="aspect-[3/4] rounded-[1.75rem] shadow-[0_30px_70px_-40px_rgba(20,20,18,0.6)]"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
