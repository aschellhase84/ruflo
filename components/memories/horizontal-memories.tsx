import { Photo } from '@/components/ui/photo';
import { Reveal } from '@/components/ui/reveal';
import { ScrollRow } from '@/components/ui/scroll-row';
import { SectionHeading } from '@/components/ui/section-heading';
import { memories } from '@/data/trip-data';
import { imageSizes } from '@/lib/utils';

/**
 * Horizontal scrollender Erinnerungsbereich.
 * Auf Mobile per Wischen, auf Desktop zusätzlich über Pfeile und Tastatur.
 */
export function HorizontalMemories() {
  return (
    <section
      id="erinnerungen"
      aria-labelledby="erinnerungen-title"
      className="relative overflow-hidden bg-ink-900 py-24 text-offwhite sm:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_10%_10%,rgba(188,107,62,0.14),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          chapter="Kapitel 05"
          title="Sechs Erinnerungen"
          titleId="erinnerungen-title"
          tone="light"
          lead="Keine Sehenswürdigkeiten, keine Programmpunkte. Nur Momente, die hängen geblieben sind."
        />
      </div>

      <ScrollRow
        label="Erinnerungen"
        className="relative mt-14 sm:mt-20"
        controlsClassName="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        {memories.map((memory, index) => (
          <Reveal
            key={memory.id}
            variant="up"
            delay={Math.min(index, 3) * 0.06}
            duration={0.9}
            className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw] xl:w-[26vw]"
          >
            <article className="group h-full">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10">
                <Photo
                  image={memory.image}
                  sizes={imageSizes.card}
                  className="transition-transform duration-[1100ms] ease-cinema group-hover:scale-[1.06]"
                />
                <div className="scrim-soft absolute inset-0" aria-hidden="true" />

                <span
                  aria-hidden="true"
                  className="absolute left-5 top-5 font-display text-4xl leading-none text-white/35 transition-colors duration-700 group-hover:text-white/60"
                >
                  {memory.index}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-display text-2xl leading-tight text-offwhite">
                    {memory.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm font-light leading-relaxed text-sand-200/70">
                {memory.text}
              </p>
            </article>
          </Reveal>
        ))}
      </ScrollRow>
    </section>
  );
}
