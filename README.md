# Toskana 2026 — digitales Urlaubsbuch

Cineastische One-Page-Website für unsere Toskana-Reise im Sommer 2026.
Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` / `npm start` | Produktionsbuild und -server |
| `npm run typecheck` | TypeScript ohne Emit |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run placeholders` | Platzhalterbilder neu erzeugen |

---

## Eigene Fotos einsetzen

**Alle Inhalte stehen in einer einzigen Datei: [`data/trip-data.ts`](data/trip-data.ts).**
Die Komponenten lesen ausschließlich von dort — für neue Fotos und Texte muss
kein Komponentencode angefasst werden.

1. Foto nach `public/images/` legen, z. B. `public/images/siena-hero.jpg`
2. In `data/trip-data.ts` beim passenden Bild `src` anpassen
   (`'/images/siena-hero.png'` → `'/images/siena-hero.jpg'`)
3. `width` und `height` auf die **echten Pixelmaße** setzen — das verhindert
   Layout Shifts und hält den Lighthouse-Wert oben
4. `alt` auf das tatsächliche Motiv anpassen (Screenreader und SEO)

Optional pro Bild:

| Feld | Wirkung |
|---|---|
| `position` | Bildausschnitt, CSS `object-position`, z. B. `'center 30%'` |
| `tone` | Farbwelt des Blur-Placeholders beim Laden (`sand`, `terracotta`, `olive`, `sky`, `dusk`, `night`, `stone`, `wine`) |

### Bildnamen und ihre Stelle auf der Seite

| Datei | Abschnitt |
|---|---|
| `hero-tuscany` | Vollbild-Einstieg |
| `journey-start`, `journey-road` | Reisebeginn |
| `rabi-*`, `siena-*`, `florence-*`, `san-gimignano-*`, `val-dorcia-*`, `montepulciano-*` | die sechs Ortskapitel |
| `food-*` | Kulinarik |
| `gallery-01 … 12` | Highlights-Galerie (Lightbox) |
| `memory-*` | horizontaler Erinnerungsbereich |
| `moment-*` | Lieblingsmomente |
| `quote-backdrop` | großes Zitat (läuft stark abgedunkelt) |
| `closing-tuscany` | Abschlussbild |

### Die mitgelieferten Platzhalter

`public/images/*.png` sind abstrakte Landschafts- und Lichtstudien in der
Farbpalette der Seite, erzeugt von
[`scripts/generate-placeholders.mjs`](scripts/generate-placeholders.mjs) —
bewusst ohne externe Bild-URLs, die später brechen könnten, und ohne
zusätzliche Abhängigkeiten (reines Node + `zlib`).

Neue Platzhalter: Eintrag im `MANIFEST` des Scripts ergänzen, dann
`npm run placeholders`. Das Script schreibt zusätzlich
`data/image-tones.ts` mit den Blur-Placeholdern (automatisch erzeugt,
nicht von Hand bearbeiten).

---

## Aufbau

```
app/          layout (Metadaten, Schriften), page (Abschnittsreihenfolge), globals.css
components/
  navigation/ FloatingNavigation (Scroll Spy, mobiles Menü), ScrollProgress
  hero/       CinematicHero (Ken-Burns + Parallaxe)
  journey/    JourneyIntro
  timeline/   JourneyTimeline (vertikal < xl, horizontal ≥ xl)
  places/     sechs eigenständige Ortslayouts + gemeinsame Bausteine
  culinary/   CulinaryGrid (asymmetrisches Raster)
  gallery/    MasonryGallery + ImageLightbox
  memories/   HorizontalMemories, QuoteSection, FavouriteMoments
  closing/    ClosingHero
  footer/     SiteFooter
  ui/         Photo, Reveal/Stagger, RevealText, ParallaxImage, ScrollRow,
              TiltCard, SectionHeading
data/         trip-data.ts (alle Inhalte), image-tones.ts (generiert)
hooks/        use-scroll-spy, use-reduced-motion, use-mouse-parallax
lib/          utils (cn, sizes-Presets)
```

### Ortslayouts

Das Feld `layout` eines Ortes bestimmt seine Darstellung — jeder Ort sieht
bewusst anders aus:

| `layout` | Ort | Aufbau |
|---|---|---|
| `sticky` | Rabi | Text bleibt stehen, Bilder laufen daneben durch |
| `editorial` | Siena | asymmetrisches Magazinraster, angeschnittenes Titelbild |
| `horizontal` | Florenz | horizontaler Bildstreifen (Swipe, Pfeile, Tastatur) |
| `stack` | San Gimignano | versetzter Kartenstapel mit Hover-Tilt |
| `panorama` | Val d'Orcia | sticky Vollbild-Panorama mit Text-Overlay |
| `duo` | Montepulciano | Bildpaar mit gegenläufigem Maus-Parallax |

---

## Bewegung und Barrierearmut

- `<MotionConfig reducedMotion="user">` in `app/page.tsx` schaltet bei
  `prefers-reduced-motion: reduce` **alle** Framer-Motion-Bewegungen auf reine
  Deckkraft um; `globals.css` stoppt zusätzlich CSS-Animationen und Smooth
  Scrolling. Ken-Burns, Parallaxe, Maus-Parallax und Tilt sind dann aus.
- Maus-Parallax und Tilt laufen nur auf Geräten mit feinem Zeiger — auf dem
  iPhone wird dafür nichts berechnet.
- Animiert wird ausschließlich `transform`/`opacity`; Scroll-Effekte hängen an
  `useScroll`/IntersectionObserver statt an eigenen Scroll-Listenern.
- Lightbox: Escape schließt, ← → blättern, Tab bleibt im Dialog, der Fokus
  kehrt danach auf die auslösende Kachel zurück, Wischen funktioniert mobil.
- Skip-Link als erster Tabstopp, sichtbare Fokusringe, semantische
  Abschnitte mit `aria-labelledby`, genau eine `h1`.

## Performance

- `next/image` mit gepflegten `width`/`height`, `sizes` und Blur-Placeholder →
  keine Layout Shifts, keine überdimensionierten Downloads auf dem iPhone
- nur das Hero-Bild lädt mit `priority`, alles andere `lazy`
- keine schweren Zusatzbibliotheken (kein GSAP, kein Lenis, kein 3D), keine
  Autoplay-Videos
- `sharp` ist als Abhängigkeit gesetzt, damit die Bildoptimierung auch im
  Produktionsbetrieb greift

## SEO

Metadaten, Open Graph und Theme Color stehen in `app/layout.tsx`.
`robots` steht bewusst auf `index: false` — es ist ein privates Urlaubsbuch.
Für eine öffentliche Veröffentlichung `NEXT_PUBLIC_SITE_URL` setzen und die
`robots`-Angabe anpassen.
