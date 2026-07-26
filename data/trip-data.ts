/**
 * ============================================================================
 *  TOSKANA 2026 — ZENTRALE INHALTSDATEI
 * ============================================================================
 *
 *  Hier werden ALLE Bilder, Orte, Texte und Galerien gepflegt.
 *  Die Komponenten lesen ausschließlich aus dieser Datei.
 *
 *  ---------------------------------------------------------------------------
 *  EIGENE FOTOS EINSETZEN — in drei Schritten:
 *  ---------------------------------------------------------------------------
 *  1. Foto nach `public/images/` legen, z. B. `public/images/siena-hero.jpg`
 *  2. Unten beim passenden Bild `src` auf den neuen Pfad ändern
 *     (z. B. '/images/siena-hero.png'  →  '/images/siena-hero.jpg')
 *  3. `width` und `height` auf die echten Pixelmaße des Fotos setzen
 *     → verhindert Layout Shifts (wichtig für den Lighthouse-Wert)
 *
 *  Optional pro Bild:
 *    - `alt`      : immer anpassen, sobald das echte Motiv bekannt ist
 *    - `position` : Bildausschnitt, z. B. 'center 30%' (CSS object-position)
 *    - `tone`     : Farbwelt für den weichen Blur-Placeholder beim Laden
 *
 *  Die mitgelieferten `.png`-Dateien sind stilvolle, abstrakte Platzhalter.
 *  Sie werden von `scripts/generate-placeholders.mjs` erzeugt (npm run placeholders).
 * ============================================================================
 */

import type { ImageTone } from './image-tones';

/* -------------------------------------------------------------------------- */
/* Typen                                                                      */
/* -------------------------------------------------------------------------- */

export interface TripImage {
  /** Pfad unterhalb von /public — hier eigenes Foto eintragen. */
  src: string;
  /** Bildbeschreibung für Screenreader und SEO. */
  alt: string;
  /** Echte Pixelbreite des Bildes. */
  width: number;
  /** Echte Pixelhöhe des Bildes. */
  height: number;
  /** CSS object-position, falls der Bildausschnitt verschoben werden soll. */
  position?: string;
  /** Farbwelt für den Blur-Placeholder. */
  tone: ImageTone;
}

export interface SectionMeta {
  id: string;
  label: string;
}

export interface TimelineStop {
  id: string;
  place: string;
  date: string;
  note: string;
  image: TripImage;
}

/** Bestimmt das Layout eines Ortskapitels — jedes Kapitel sieht anders aus. */
export type PlaceLayout =
  | 'sticky'
  | 'editorial'
  | 'horizontal'
  | 'stack'
  | 'panorama'
  | 'duo';

export interface PlaceFact {
  label: string;
  value: string;
}

export interface Place {
  id: string;
  /** Kapitelnummer, z. B. "01" */
  chapter: string;
  name: string;
  region: string;
  /** Kurze, emotionale Beschreibung — zwei bis vier Sätze. */
  description: string;
  /** Einzelner Satz, der als großes Zitat/Overlay funktioniert. */
  highlight: string;
  layout: PlaceLayout;
  hero: TripImage;
  gallery: TripImage[];
  facts: PlaceFact[];
}

export interface CulinaryItem {
  id: string;
  title: string;
  note: string;
  image: TripImage;
  /** Rasterfläche im asymmetrischen Grid (Tailwind-Klassen auf lg-Breakpoint). */
  span: string;
}

export interface GalleryItem {
  id: string;
  caption: string;
  image: TripImage;
}

export interface MemoryCard {
  id: string;
  index: string;
  title: string;
  text: string;
  image: TripImage;
}

export interface FavouriteMoment {
  id: string;
  kicker: string;
  title: string;
  text: string;
  image: TripImage;
  /** Karten-Variante — sorgt für optisch unterschiedliche Karten. */
  variant: 'wide' | 'portrait' | 'text' | 'square';
}

/* -------------------------------------------------------------------------- */
/* Rahmendaten der Reise                                                      */
/* -------------------------------------------------------------------------- */

export const trip = {
  title: 'Toskana 2026',
  kicker: 'Unser Sommer in Italien',
  subtitle:
    'Eine Reise aus Licht, Landschaft, Genuss und gemeinsamen Momenten',
  period: '18. Juli – 3. August 2026',
  region: 'Toskana, Italien',
  coordinates: '43°19′ N · 11°19′ O',
  weather: '31 °C · leichter Wind aus Südwest',
  footerNote: 'Digitales Urlaubsbuch — mit Liebe festgehalten',
} as const;

/** Navigationsziele — identisch mit den `id`s der Sections in app/page.tsx. */
export const sections: SectionMeta[] = [
  { id: 'beginn', label: 'Beginn' },
  { id: 'route', label: 'Route' },
  { id: 'orte', label: 'Orte' },
  { id: 'genuss', label: 'Genuss' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'erinnerungen', label: 'Erinnerungen' },
];

/* -------------------------------------------------------------------------- */
/* 1 · Cinematic Hero                                                         */
/* -------------------------------------------------------------------------- */

/** ERSETZEN: großes Titelbild der Reise (Querformat, mind. 1920px breit). */
export const heroImage: TripImage = {
  src: '/images/hero-tuscany.png',
  alt: 'Weite toskanische Hügellandschaft im warmen Abendlicht',
  width: 1920,
  height: 1200,
  tone: 'dusk',
  position: 'center 55%',
};

/* -------------------------------------------------------------------------- */
/* 2 · Reisebeginn                                                            */
/* -------------------------------------------------------------------------- */

export const journey = {
  chapter: 'Kapitel 01',
  title: 'Der Weg in den Süden',
  lead:
    'Manche Reisen beginnen nicht erst am Ziel. Sie beginnen mit gepackten Taschen, leeren Autobahnen am Morgen und dem Gefühl, dass vor einem etwas Besonderes liegt.',
  text:
    'Zwischen dem letzten Blick auf den Hof und der ersten Kurve hinter den Alpen liegen viele Stunden — und trotzdem fühlt es sich an wie ein einziger langer Moment. Der Kaffee an der Raststätte. Die Musik, die niemand wechselt. Das Licht, das langsam wärmer wird.',
  milestones: [
    { label: 'Abfahrt', value: '05:40 Uhr' },
    { label: 'Strecke', value: '1.284 km' },
    { label: 'Ankunft', value: 'Zwei Tage später' },
  ],
  /** ERSETZEN: Hochformat — Aufbruch, gepackte Taschen, leere Autobahn. */
  imagePortrait: {
    src: '/images/journey-start.png',
    alt: 'Frühmorgendliches Licht am Tag der Abfahrt',
    width: 1200,
    height: 1500,
    tone: 'sky',
  } satisfies TripImage,
  /** ERSETZEN: Querformat — unterwegs, Landstraße, erste Zypressen. */
  imageWide: {
    src: '/images/journey-road.png',
    alt: 'Landstraße zwischen Zypressen auf dem Weg in die Toskana',
    width: 1400,
    height: 1000,
    tone: 'olive',
  } satisfies TripImage,
};

/* -------------------------------------------------------------------------- */
/* 3 · Animierte Reiseroute                                                   */
/* -------------------------------------------------------------------------- */

export const timeline: TimelineStop[] = [
  {
    id: 'essen',
    place: 'Essen',
    date: '18. Juli',
    note: 'Der Kofferraum ist voll, der Himmel noch grau. Es geht los.',
    image: {
      src: '/images/journey-start.png',
      alt: 'Abfahrt in Essen am frühen Morgen',
      width: 1200,
      height: 1500,
      tone: 'sky',
    },
  },
  {
    id: 'bayern',
    place: 'Zwischenstopp in Bayern',
    date: '18. Juli',
    note: 'Eine Nacht, ein Bier, und die Alpen schon fast in Sichtweite.',
    image: {
      src: '/images/journey-road.png',
      alt: 'Zwischenstopp in Bayern vor der Alpenüberquerung',
      width: 1400,
      height: 1000,
      tone: 'olive',
    },
  },
  {
    id: 'ankunft',
    place: 'Ankunft in der Toskana',
    date: '19. Juli',
    note: 'Die Luft riecht plötzlich anders. Warm, trocken, nach Pinien.',
    image: {
      src: '/images/val-dorcia-01.png',
      alt: 'Erste Hügel der Toskana bei der Ankunft',
      width: 1400,
      height: 1000,
      tone: 'sand',
    },
  },
  {
    id: 'rabi',
    place: 'Rabi',
    date: '19.–26. Juli',
    note: 'Unser Zuhause auf Zeit. Steinhaus, Feigenbaum, viel Stille.',
    image: {
      src: '/images/rabi-hero.png',
      alt: 'Das Steinhaus in Rabi zwischen Olivenbäumen',
      width: 1600,
      height: 1000,
      tone: 'olive',
    },
  },
  {
    id: 'siena',
    place: 'Siena',
    date: '21. Juli',
    note: 'Gassen, die sich öffnen wie ein Vorhang — und dann der Platz.',
    image: {
      src: '/images/siena-hero.png',
      alt: 'Dächer von Siena im Nachmittagslicht',
      width: 1600,
      height: 1000,
      tone: 'terracotta',
    },
  },
  {
    id: 'florenz',
    place: 'Florenz',
    date: '24. Juli',
    note: 'Zu viel Schönheit für einen Tag. Wir kommen wieder.',
    image: {
      src: '/images/florence-hero.png',
      alt: 'Blick über die Dächer von Florenz',
      width: 1600,
      height: 1000,
      tone: 'stone',
    },
  },
  {
    id: 'san-gimignano',
    place: 'San Gimignano',
    date: '27. Juli',
    note: 'Türme am Horizont, lange bevor man die Stadt erreicht.',
    image: {
      src: '/images/san-gimignano-hero.png',
      alt: 'Die Türme von San Gimignano über den Hügeln',
      width: 1600,
      height: 1000,
      tone: 'sand',
    },
  },
  {
    id: 'val-dorcia',
    place: "Val d'Orcia",
    date: '30. Juli',
    note: 'Die Landschaft, die man kennt, bevor man sie gesehen hat.',
    image: {
      src: '/images/val-dorcia-hero.png',
      alt: "Sanfte Hügel im Val d'Orcia",
      width: 2200,
      height: 1100,
      tone: 'olive',
    },
  },
  {
    id: 'heimreise',
    place: 'Heimreise',
    date: '3. August',
    note: 'Sand in den Schuhen, Sonne auf der Haut, still im Auto.',
    image: {
      src: '/images/memory-sunset.png',
      alt: 'Letzter Blick auf die Toskana am Tag der Heimreise',
      width: 1200,
      height: 1500,
      tone: 'terracotta',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* 4 · Unsere schönsten Orte                                                  */
/* -------------------------------------------------------------------------- */

export const places: Place[] = [
  {
    id: 'rabi',
    chapter: '01',
    name: 'Rabi',
    region: 'Provinz Siena',
    layout: 'sticky',
    description:
      'Ein Steinhaus am Hang, ein Feigenbaum vor der Tür und ein Weg, der irgendwann einfach aufhört. Rabi war kein Ausflugsziel — Rabi war der Ort, an dem der Urlaub tatsächlich begann. Morgens Vogelstimmen, mittags Zikaden, abends nur noch Grillen und das Klirren von Gläsern.',
    highlight:
      'Nach drei Tagen wussten wir, welche Stufe knarrt und wo die Sonne zuerst hinfällt.',
    hero: {
      src: '/images/rabi-hero.png',
      alt: 'Steinhaus in Rabi zwischen Olivenbäumen',
      width: 1600,
      height: 1000,
      tone: 'olive',
    },
    gallery: [
      {
        src: '/images/rabi-01.png',
        alt: 'Olivenhain hinter dem Haus am frühen Morgen',
        width: 1200,
        height: 1500,
        tone: 'sand',
      },
      {
        src: '/images/rabi-02.png',
        alt: 'Blick vom Hang über das Tal',
        width: 1200,
        height: 1500,
        tone: 'olive',
      },
      {
        src: '/images/rabi-03.png',
        alt: 'Abendlicht auf der Terrasse',
        width: 1200,
        height: 1500,
        tone: 'dusk',
      },
    ],
    facts: [
      { label: 'Aufenthalt', value: '7 Nächte' },
      { label: 'Nächster Ort', value: '11 km Schotterweg' },
      { label: 'Lieblingszeit', value: 'Kurz vor acht' },
    ],
  },
  {
    id: 'siena',
    chapter: '02',
    name: 'Siena',
    region: 'Toskana',
    layout: 'editorial',
    description:
      'Siena macht es einem nicht leicht. Man läuft durch enge, schattige Gassen, verliert die Orientierung, und dann öffnet sich der Campo wie eine Bühne. Wir haben uns einfach auf den warmen Backstein gesetzt und eine Stunde lang nichts getan.',
    highlight: 'Ein Platz, der aussieht, als hätte ihn jemand für genau diesen Moment gebaut.',
    hero: {
      src: '/images/siena-hero.png',
      alt: 'Dächer und Türme von Siena im Nachmittagslicht',
      width: 1600,
      height: 1000,
      tone: 'terracotta',
    },
    gallery: [
      {
        src: '/images/siena-01.png',
        alt: 'Schmale Gasse in der Altstadt von Siena',
        width: 1100,
        height: 1400,
        tone: 'terracotta',
      },
      {
        src: '/images/siena-02.png',
        alt: 'Backsteinfassaden rund um die Piazza del Campo',
        width: 1400,
        height: 1000,
        tone: 'sand',
      },
      {
        src: '/images/siena-03.png',
        alt: 'Detail einer alten Holztür in Siena',
        width: 1100,
        height: 1100,
        tone: 'wine',
      },
    ],
    facts: [
      { label: 'Ankunft', value: '15:20 Uhr' },
      { label: 'Höhenmeter', value: '322 m' },
      { label: 'Gelato', value: 'Zweimal' },
    ],
  },
  {
    id: 'florenz',
    chapter: '03',
    name: 'Florenz',
    region: 'Arnotal',
    layout: 'horizontal',
    description:
      'Florenz ist laut, voll und großartig. Wir sind früh angekommen, als die Stadt noch halb schlief, und haben den Rest des Tages einfach treiben lassen. Am Abend saßen wir am Fluss und haben zugesehen, wie das Licht die Fassaden goldener machte, als sie ohnehin schon waren.',
    highlight: 'Zu viel Schönheit für einen einzigen Tag.',
    hero: {
      src: '/images/florence-hero.png',
      alt: 'Blick über die Dächer von Florenz',
      width: 1600,
      height: 1000,
      tone: 'stone',
    },
    gallery: [
      {
        src: '/images/florence-01.png',
        alt: 'Steinfassade in der Altstadt von Florenz',
        width: 1100,
        height: 1400,
        tone: 'stone',
      },
      {
        src: '/images/florence-02.png',
        alt: 'Licht und Schatten in einer Seitengasse',
        width: 1100,
        height: 1400,
        tone: 'sand',
      },
      {
        src: '/images/florence-03.png',
        alt: 'Abendstimmung über dem Arno',
        width: 1100,
        height: 1400,
        tone: 'dusk',
      },
      {
        src: '/images/florence-04.png',
        alt: 'Detail an einer alten Hausfassade',
        width: 1100,
        height: 1400,
        tone: 'wine',
      },
    ],
    facts: [
      { label: 'Schritte', value: '21.400' },
      { label: 'Beste Stunde', value: '19:00 – 20:00' },
      { label: 'Pausen', value: 'Zu wenige' },
    ],
  },
  {
    id: 'san-gimignano',
    chapter: '04',
    name: 'San Gimignano',
    region: 'Val d’Elsa',
    layout: 'stack',
    description:
      'Die Türme sieht man lange, bevor man ankommt — erst als Silhouette, dann als Versprechen. Oben zwischen den Mauern war es kühl und still, unten breitete sich die Landschaft aus wie ein aufgeschlagenes Buch.',
    highlight: 'Vierzehn Türme, und wir haben trotzdem nur nach unten geschaut.',
    hero: {
      src: '/images/san-gimignano-hero.png',
      alt: 'Die Türme von San Gimignano über den Hügeln',
      width: 1600,
      height: 1000,
      tone: 'sand',
    },
    gallery: [
      {
        src: '/images/san-gimignano-01.png',
        alt: 'Mittelalterliche Turmhäuser aus der Nähe',
        width: 1200,
        height: 1500,
        tone: 'stone',
      },
      {
        src: '/images/san-gimignano-02.png',
        alt: 'Weinberge unterhalb der Stadtmauer',
        width: 1400,
        height: 1000,
        tone: 'olive',
      },
      {
        src: '/images/san-gimignano-03.png',
        alt: 'Warmer Stein in der Nachmittagssonne',
        width: 1200,
        height: 1200,
        tone: 'terracotta',
      },
    ],
    facts: [
      { label: 'Türme', value: '14' },
      { label: 'Anfahrt', value: '48 Minuten' },
      { label: 'Wind', value: 'Angenehm' },
    ],
  },
  {
    id: 'val-dorcia',
    chapter: '05',
    name: "Val d'Orcia",
    region: 'Südliche Toskana',
    layout: 'panorama',
    description:
      'Es gibt Landschaften, die man kennt, bevor man sie gesehen hat. Und dann steht man da, an einem Feldweg, mit Staub an den Schuhen, und merkt: Es ist trotzdem größer als gedacht.',
    highlight:
      'Wir sind angehalten, ausgestiegen und haben eine Viertelstunde lang nichts gesagt.',
    hero: {
      src: '/images/val-dorcia-hero.png',
      alt: "Sanft gewellte Hügel im Val d'Orcia",
      width: 2200,
      height: 1100,
      tone: 'olive',
      position: 'center 60%',
    },
    gallery: [
      {
        src: '/images/val-dorcia-01.png',
        alt: 'Zypressenallee auf einem Hügelkamm',
        width: 1400,
        height: 1000,
        tone: 'sand',
      },
      {
        src: '/images/val-dorcia-02.png',
        alt: 'Abendlicht über den Feldern',
        width: 1400,
        height: 1000,
        tone: 'dusk',
      },
    ],
    facts: [
      { label: 'Uhrzeit', value: '19:48 Uhr' },
      { label: 'Umweg', value: '23 km' },
      { label: 'Wert', value: 'Jeder Meter' },
    ],
  },
  {
    id: 'montepulciano',
    chapter: '06',
    name: 'Montepulciano',
    region: 'Provinz Siena',
    layout: 'duo',
    description:
      'Eine Stadt, die sich nach oben schraubt. Jede Gasse steiler als die vorige, jeder Ausblick ein bisschen weiter. Oben angekommen war der Wein kühl und die Aussicht endlos — beides hat sich angefühlt wie eine Belohnung.',
    highlight: 'Oben angekommen war klar, warum alle nach oben laufen.',
    hero: {
      src: '/images/montepulciano-hero.png',
      alt: 'Gassen und Fassaden in Montepulciano',
      width: 1600,
      height: 1000,
      tone: 'wine',
    },
    gallery: [
      {
        src: '/images/montepulciano-01.png',
        alt: 'Weinkeller im alten Gemäuer',
        width: 1200,
        height: 1500,
        tone: 'wine',
      },
      {
        src: '/images/montepulciano-02.png',
        alt: 'Blick von der Stadtmauer über die Weinberge',
        width: 1200,
        height: 1500,
        tone: 'terracotta',
      },
    ],
    facts: [
      { label: 'Höhe', value: '605 m' },
      { label: 'Steigung', value: 'Ehrlich gesagt: viel' },
      { label: 'Belohnung', value: 'Ein Glas Vino Nobile' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 5 · Kulinarik                                                              */
/* -------------------------------------------------------------------------- */

export const culinary = {
  chapter: 'Kapitel 03',
  title: 'Der Geschmack der Toskana',
  lead:
    'Es waren selten die aufwendigen Gerichte. Es waren gutes Öl, warmes Brot und die Ruhe, sich Zeit zu nehmen.',
  items: [
    {
      id: 'dinner',
      title: 'Ein Abend, der länger blieb als geplant',
      note: 'Aus einem Glas wurden drei, aus dem Abend eine Nacht.',
      image: {
        src: '/images/food-dinner.png',
        alt: 'Gedeckter Tisch im Abendlicht',
        width: 1600,
        height: 900,
        tone: 'dusk',
      },
      span: 'lg:col-span-7 lg:row-span-2',
    },
    {
      id: 'pasta',
      title: 'Pasta, die keine Erklärung brauchte',
      note: 'Vier Zutaten. Mehr war nicht nötig.',
      image: {
        src: '/images/food-pasta.png',
        alt: 'Frische Pasta auf einem einfachen Teller',
        width: 1200,
        height: 1200,
        tone: 'sand',
      },
      span: 'lg:col-span-5',
    },
    {
      id: 'wine',
      title: 'Ein Glas Wein zwischen Sonne und Abendlicht',
      note: 'Der Rotwein war warm, die Luft auch.',
      image: {
        src: '/images/food-wine.png',
        alt: 'Rotweinglas im Gegenlicht',
        width: 1100,
        height: 1500,
        tone: 'wine',
      },
      span: 'lg:col-span-5 lg:row-span-2',
    },
    {
      id: 'breakfast',
      title: 'Frühstück ohne Uhrzeit',
      note: 'Brot, Aprikosen, Espresso. Und niemand, der drängelt.',
      image: {
        src: '/images/food-breakfast.png',
        alt: 'Frühstückstisch auf der Terrasse',
        width: 1400,
        height: 1000,
        tone: 'sand',
      },
      span: 'lg:col-span-7',
    },
    {
      id: 'pizza',
      title: 'Dünn, heiß, ohne Kompromiss',
      note: 'Der Ofen war älter als das halbe Dorf.',
      image: {
        src: '/images/food-pizza.png',
        alt: 'Pizza frisch aus dem Holzofen',
        width: 1400,
        height: 1000,
        tone: 'terracotta',
      },
      span: 'lg:col-span-4',
    },
    {
      id: 'gelato',
      title: 'Der Geschmack eines Tages, den man nicht vergessen will',
      note: 'Pistazie. Immer Pistazie.',
      image: {
        src: '/images/food-gelato.png',
        alt: 'Gelato in der Waffel',
        width: 1100,
        height: 1300,
        tone: 'stone',
      },
      span: 'lg:col-span-4',
    },
    {
      id: 'market',
      title: 'Alles vom Markt, nichts weit gereist',
      note: 'Tomaten, die noch nach Sonne schmeckten.',
      image: {
        src: '/images/food-market.png',
        alt: 'Regionale Produkte vom Wochenmarkt',
        width: 1200,
        height: 1200,
        tone: 'olive',
      },
      span: 'lg:col-span-4',
    },
  ] satisfies CulinaryItem[],
};

/* -------------------------------------------------------------------------- */
/* 6 · Highlights-Galerie                                                     */
/* -------------------------------------------------------------------------- */

export const gallery = {
  chapter: 'Kapitel 04',
  title: 'Augenblicke, die bleiben',
  lead:
    'Kein Programm, keine Reihenfolge. Nur die Bilder, bei denen wir hängen geblieben sind.',
  items: [
    {
      id: 'g01',
      caption: 'Der Hang hinter dem Haus, kurz vor Sonnenuntergang',
      image: {
        src: '/images/gallery-01.png',
        alt: 'Hügel im Abendlicht hinter dem Ferienhaus',
        width: 1200,
        height: 1500,
        tone: 'dusk',
      },
    },
    {
      id: 'g02',
      caption: 'Weiter Blick über das Tal am zweiten Morgen',
      image: {
        src: '/images/gallery-02.png',
        alt: 'Panoramablick über ein toskanisches Tal',
        width: 1400,
        height: 1000,
        tone: 'sand',
      },
    },
    {
      id: 'g03',
      caption: 'Warme Fassaden in der Mittagssonne',
      image: {
        src: '/images/gallery-03.png',
        alt: 'Terrakottafarbene Hausfassaden',
        width: 1200,
        height: 1200,
        tone: 'terracotta',
      },
    },
    {
      id: 'g04',
      caption: 'Zypressen, die den Weg markieren',
      image: {
        src: '/images/gallery-04.png',
        alt: 'Zypressenreihe entlang eines Feldwegs',
        width: 1100,
        height: 1450,
        tone: 'olive',
      },
    },
    {
      id: 'g05',
      caption: 'Ein Himmel, der einfach nicht aufhörte',
      image: {
        src: '/images/gallery-05.png',
        alt: 'Weiter blauer Himmel über den Hügeln',
        width: 1400,
        height: 950,
        tone: 'sky',
      },
    },
    {
      id: 'g06',
      caption: 'Stein, Schatten und ein schmaler Streifen Licht',
      image: {
        src: '/images/gallery-06.png',
        alt: 'Alte Steinmauer mit Lichtstreifen',
        width: 1200,
        height: 1500,
        tone: 'stone',
      },
    },
    {
      id: 'g07',
      caption: 'Der Tisch, an dem wir am längsten saßen',
      image: {
        src: '/images/gallery-07.png',
        alt: 'Gedeckter Tisch am Abend',
        width: 1300,
        height: 1000,
        tone: 'wine',
      },
    },
    {
      id: 'g08',
      caption: 'Olivenblätter im Gegenlicht',
      image: {
        src: '/images/gallery-08.png',
        alt: 'Olivenzweige im Gegenlicht',
        width: 1200,
        height: 1200,
        tone: 'olive',
      },
    },
    {
      id: 'g09',
      caption: 'Mittagsstille auf der Terrasse',
      image: {
        src: '/images/gallery-09.png',
        alt: 'Leere Terrasse in der Mittagshitze',
        width: 1100,
        height: 1400,
        tone: 'sand',
      },
    },
    {
      id: 'g10',
      caption: 'Der Weg zurück, ohne Eile',
      image: {
        src: '/images/gallery-10.png',
        alt: 'Feldweg im Abendlicht',
        width: 1500,
        height: 1000,
        tone: 'dusk',
      },
    },
    {
      id: 'g11',
      caption: 'Nach Sonnenuntergang wurde es endlich kühl',
      image: {
        src: '/images/gallery-11.png',
        alt: 'Dämmerung über den Hügeln',
        width: 1200,
        height: 1500,
        tone: 'night',
      },
    },
    {
      id: 'g12',
      caption: 'Letztes Licht auf dem Hügelkamm',
      image: {
        src: '/images/gallery-12.png',
        alt: 'Letzte Sonnenstrahlen auf einem Hügelkamm',
        width: 1400,
        height: 1000,
        tone: 'terracotta',
      },
    },
  ] satisfies GalleryItem[],
};

/* -------------------------------------------------------------------------- */
/* 7 · Horizontaler Erinnerungsbereich                                        */
/* -------------------------------------------------------------------------- */

export const memories: MemoryCard[] = [
  {
    id: 'first-look',
    index: '01',
    title: 'Der erste Blick',
    text: 'Wir sind aus dem Auto gestiegen und haben erst mal nichts gesagt. Manche Aussichten brauchen einen Moment.',
    image: {
      src: '/images/memory-first-look.png',
      alt: 'Erster Blick über die toskanische Landschaft',
      width: 1200,
      height: 1500,
      tone: 'sky',
    },
  },
  {
    id: 'morning-light',
    index: '02',
    title: 'Licht am Morgen',
    text: 'Um kurz nach sieben liegt alles in einem Gold, das man nicht fotografieren kann. Wir haben es trotzdem versucht.',
    image: {
      src: '/images/memory-morning-light.png',
      alt: 'Morgenlicht über dem Olivenhain',
      width: 1200,
      height: 1500,
      tone: 'sand',
    },
  },
  {
    id: 'detour',
    index: '03',
    title: 'Kleine Umwege',
    text: 'Die falsche Abzweigung führte zu einem Feldweg, einem Hof und dem besten Olivenöl der ganzen Reise.',
    image: {
      src: '/images/memory-detour.png',
      alt: 'Schotterweg zwischen Feldern',
      width: 1200,
      height: 1500,
      tone: 'olive',
    },
  },
  {
    id: 'long-evenings',
    index: '04',
    title: 'Lange Abende',
    text: 'Draußen bleiben, bis die Mücken kommen. Und dann noch eine halbe Stunde länger.',
    image: {
      src: '/images/memory-evening.png',
      alt: 'Abendstimmung auf der Terrasse',
      width: 1200,
      height: 1500,
      tone: 'dusk',
    },
  },
  {
    id: 'quiet',
    index: '05',
    title: 'Ein stiller Moment',
    text: 'Mittags war es zu heiß für alles. Genau das war das Beste daran.',
    image: {
      src: '/images/memory-quiet.png',
      alt: 'Ruhiger Innenhof in der Mittagshitze',
      width: 1200,
      height: 1500,
      tone: 'stone',
    },
  },
  {
    id: 'last-sunset',
    index: '06',
    title: 'Der letzte Sonnenuntergang',
    text: 'Niemand wollte reingehen. Also sind wir geblieben, bis wirklich nichts mehr zu sehen war.',
    image: {
      src: '/images/memory-sunset.png',
      alt: 'Letzter Sonnenuntergang der Reise',
      width: 1200,
      height: 1500,
      tone: 'terracotta',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* 8 · Großes Zitat                                                           */
/* -------------------------------------------------------------------------- */

export const quote = {
  text:
    'Wir erinnern uns nicht an jeden Tag. Aber an die Momente, die sich wie Zuhause angefühlt haben.',
  attribution: 'Toskana, Sommer 2026',
  /** ERSETZEN: sehr ruhiges, flächiges Bild — läuft stark abgedunkelt im Hintergrund. */
  image: {
    src: '/images/quote-backdrop.png',
    alt: '',
    width: 1600,
    height: 1000,
    tone: 'stone',
  } satisfies TripImage,
};

/* -------------------------------------------------------------------------- */
/* 9 · Lieblingsmomente                                                       */
/* -------------------------------------------------------------------------- */

export const favourites = {
  chapter: 'Kapitel 06',
  title: 'Unsere Lieblingsmomente',
  lead: 'Am Ende bleiben fünf Antworten auf fünf Fragen, die wir uns nie gestellt haben.',
  items: [
    {
      id: 'view',
      kicker: 'Schönster Ausblick',
      title: 'Der Hügelkamm hinter Pienza',
      text: 'Wir wollten nur kurz halten. Geblieben sind wir, bis die Sonne weg war.',
      variant: 'wide',
      image: {
        src: '/images/moment-view.png',
        alt: 'Weiter Ausblick über die Hügel',
        width: 1400,
        height: 1000,
        tone: 'sky',
      },
    },
    {
      id: 'evening',
      kicker: 'Bester Abend',
      title: 'Der Tisch unter dem Feigenbaum',
      text: 'Kerzenlicht, ein einfaches Essen und ein Gespräch, das keiner beenden wollte.',
      variant: 'portrait',
      image: {
        src: '/images/moment-evening.png',
        alt: 'Abendessen unter freiem Himmel',
        width: 1200,
        height: 1200,
        tone: 'dusk',
      },
    },
    {
      id: 'food',
      kicker: 'Lieblingsessen',
      title: 'Pici mit Tomate, sonst nichts',
      text: 'Handgerollt, dick, unregelmäßig — und besser als alles, was wir je bestellt haben.',
      variant: 'square',
      image: {
        src: '/images/moment-food.png',
        alt: 'Teller mit handgemachter Pasta',
        width: 1200,
        height: 1200,
        tone: 'wine',
      },
    },
    {
      id: 'unexpected',
      kicker: 'Unerwarteter Moment',
      title: 'Das Gewitter am fünften Abend',
      text: 'Zwanzig Minuten Regen auf heißem Stein. Der Geruch war das eigentliche Ereignis.',
      variant: 'text',
      image: {
        src: '/images/moment-unexpected.png',
        alt: 'Wolken über den Feldern nach dem Gewitter',
        width: 1400,
        height: 1000,
        tone: 'olive',
      },
    },
    {
      id: 'place',
      kicker: 'Unser gemeinsamer Lieblingsort',
      title: 'Die Stufen vor dem Haus',
      text: 'Kein Aussichtspunkt, kein Ziel. Nur der Platz, an dem wir jeden Abend gelandet sind.',
      variant: 'wide',
      image: {
        src: '/images/moment-place.png',
        alt: 'Steinstufen vor dem Ferienhaus',
        width: 1400,
        height: 1000,
        tone: 'sand',
      },
    },
  ] satisfies FavouriteMoment[],
};

/* -------------------------------------------------------------------------- */
/* 10 · Abschluss                                                             */
/* -------------------------------------------------------------------------- */

export const closing = {
  title: 'Grazie Toscana',
  subtitle: 'Für das Licht. Für die Ruhe. Für die Erinnerungen.',
  note: 'Toskana 2026',
  /** ERSETZEN: großes Abschlussbild im Querformat (mind. 1920px breit). */
  image: {
    src: '/images/closing-tuscany.png',
    alt: 'Weiter Blick über die Toskana am letzten Abend',
    width: 1920,
    height: 1200,
    tone: 'terracotta',
    position: 'center 50%',
  } satisfies TripImage,
};
