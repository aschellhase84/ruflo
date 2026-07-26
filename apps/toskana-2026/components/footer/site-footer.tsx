'use client';

import { sections, trip } from '@/data/trip-data';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/** Minimalistischer Abschluss mit Sprungmarke zurück nach oben. */
export function SiteFooter() {
  const reduced = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="border-t border-sand-300/70 bg-offwhite">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl text-ink-800 sm:text-4xl">
              {trip.title}
            </p>
            <p className="mt-3 text-sm font-light text-ink-400">
              Digitales Urlaubsbuch
            </p>
            <p className="mt-1 text-sm font-light text-ink-400">
              Mit Liebe festgehalten
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-3 self-start rounded-full border border-sand-400/70 px-6 py-3.5 text-sm font-medium text-ink-600 transition-all duration-500 ease-cinema hover:border-ink-800 hover:bg-ink-900 hover:text-offwhite sm:self-auto"
          >
            Zurück nach oben
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 -rotate-90 transition-transform duration-500 ease-cinema group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="hairline my-10" aria-hidden="true" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Fußzeilen-Navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400 transition-colors duration-300 hover:text-ink-800"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-xs font-light text-sand-600">
            {trip.period}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            {trip.region}
          </p>
        </div>
      </div>
    </footer>
  );
}
