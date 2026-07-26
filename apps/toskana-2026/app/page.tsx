'use client';

import { MotionConfig } from 'framer-motion';

import { ClosingHero } from '@/components/closing/closing-hero';
import { CulinaryGrid } from '@/components/culinary/culinary-grid';
import { SiteFooter } from '@/components/footer/site-footer';
import { MasonryGallery } from '@/components/gallery/masonry-gallery';
import { CinematicHero } from '@/components/hero/cinematic-hero';
import { JourneyIntro } from '@/components/journey/journey-intro';
import { FavouriteMoments } from '@/components/memories/favourite-moments';
import { HorizontalMemories } from '@/components/memories/horizontal-memories';
import { QuoteSection } from '@/components/memories/quote-section';
import { FloatingNavigation } from '@/components/navigation/floating-navigation';
import { ScrollProgress } from '@/components/navigation/scroll-progress';
import { PlacesSection } from '@/components/places/places-section';
import { JourneyTimeline } from '@/components/timeline/journey-timeline';

/**
 * Toskana 2026 — digitales Urlaubsbuch als One-Page-Website.
 *
 * `MotionConfig reducedMotion="user"` gilt für den gesamten Baum: Framer
 * Motion reduziert dann alle Transform-Animationen auf reine Deckkraft —
 * ohne dass jede Komponente das einzeln behandeln müsste.
 */
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#hauptinhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <ScrollProgress />
      <FloatingNavigation />

      <main id="hauptinhalt">
        <span id="top" className="sr-only" aria-hidden="true" />

        {/* 1 · Cineastischer Einstieg */}
        <CinematicHero />

        {/* 2 · Reisebeginn */}
        <JourneyIntro />

        {/* 3 · Animierte Reiseroute */}
        <JourneyTimeline />

        {/* 4 · Unsere schönsten Orte — sechs eigenständige Layouts */}
        <PlacesSection />

        {/* 5 · Kulinarik */}
        <CulinaryGrid />

        {/* 6 · Highlights-Galerie mit Lightbox */}
        <MasonryGallery />

        {/* 7 · Horizontaler Erinnerungsbereich */}
        <HorizontalMemories />

        {/* 8 · Großes Zitat */}
        <QuoteSection />

        {/* 9 · Lieblingsmomente */}
        <FavouriteMoments />

        {/* 10 · Abschluss */}
        <ClosingHero />
      </main>

      {/* 11 · Footer */}
      <SiteFooter />
    </MotionConfig>
  );
}
