import { DuoStory } from '@/components/places/duo-story';
import { EditorialStory } from '@/components/places/editorial-story';
import { HorizontalStory } from '@/components/places/horizontal-story';
import { PanoramaStory } from '@/components/places/panorama-story';
import { StackStory } from '@/components/places/stack-story';
import { StickyStory } from '@/components/places/sticky-story';
import { SectionHeading } from '@/components/ui/section-heading';
import { places, type Place, type PlaceLayout } from '@/data/trip-data';

/**
 * Jeder Ort bekommt bewusst ein eigenes Layout — kein wiederholtes
 * Kartenraster. Das Layout wird in data/trip-data.ts über `layout` gesetzt.
 */
const LAYOUTS: Record<PlaceLayout, (props: { place: Place }) => JSX.Element> = {
  sticky: StickyStory,
  editorial: EditorialStory,
  horizontal: HorizontalStory,
  stack: StackStory,
  panorama: PanoramaStory,
  duo: DuoStory,
};

export function PlacesSection() {
  return (
    <section id="orte" aria-labelledby="orte-title" className="bg-offwhite">
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <SectionHeading
          chapter="Kapitel 03"
          title="Unsere schönsten Orte"
          titleId="orte-title"
          lead="Sechs Orte, sechs sehr unterschiedliche Tage — und jeder hat seine eigene Erinnerung hinterlassen."
        />
      </div>

      {places.map((place) => {
        const Layout = LAYOUTS[place.layout];
        return <Layout key={place.id} place={place} />;
      })}
    </section>
  );
}
