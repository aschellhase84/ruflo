'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { sections, trip } from '@/data/trip-data';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

const NAV_IDS = sections.map((section) => section.id);

/**
 * Schwebende, halbtransparente Hauptnavigation.
 *
 * - Scroll Spy über IntersectionObserver (siehe hooks/use-scroll-spy)
 * - Smooth Scroll über native Anker + `scroll-behavior` in globals.css
 *   → funktioniert auch ohne JavaScript und respektiert prefers-reduced-motion
 * - Wird beim Scrollen kompakter
 * - Auf Mobile: Vollbild-Menü, per Escape und Tap schließbar
 */
export function FloatingNavigation() {
  const activeId = useScrollSpy(NAV_IDS);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, 'change', (value) => {
    setCompact((current) => {
      // Hysterese: verhindert Flackern genau an der Schwelle.
      if (!current && value > 90) return true;
      if (current && value < 40) return false;
      return current;
    });
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /*
   * Menü beim Wechsel auf Desktopbreite schließen.
   *
   * Ab `md` blendet CSS sowohl das Overlay als auch den Menü-Schalter aus.
   * Bliebe `menuOpen` dabei true, liefe die Scroll-Sperre weiter, ohne dass
   * es noch eine sichtbare Möglichkeit zum Schließen gäbe — auf einem
   * Touchgerät ohne Escape-Taste wäre die Seite dann unscrollbar. Auslöser
   * dafür ist im Alltag das Drehen eines Tablets ins Querformat.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const query = window.matchMedia('(min-width: 768px)');
    const check = () => {
      if (query.matches) setMenuOpen(false);
    };

    check();
    query.addEventListener('change', check);
    return () => query.removeEventListener('change', check);
  }, [menuOpen]);

  // Escape, Tab-Umlauf, Scroll-Sperre und Fokusrückgabe.
  // Der Trap umfasst Header UND Overlay: Der Schalter zum Schließen sitzt im
  // Header, die Menüpunkte im Overlay darunter — beides ist sichtbar und muss
  // per Tastatur erreichbar bleiben.
  useFocusTrap({
    active: menuOpen,
    containers: [headerRef, menuRef],
    onEscape: closeMenu,
    initialFocus: toggleRef,
  });

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 z-40 flex justify-center px-4 transition-all duration-500 ease-cinema',
          compact ? 'top-2 sm:top-3' : 'top-4 sm:top-6',
        )}
      >
        <nav
          aria-label="Hauptnavigation"
          className={cn(
            'glass flex w-full max-w-3xl items-center justify-between gap-3 rounded-full transition-all duration-500 ease-cinema',
            compact ? 'py-1.5 pl-4 pr-1.5 sm:pl-5' : 'py-2.5 pl-5 pr-2.5 sm:pl-7',
          )}
        >
          <a
            href="#top"
            className={cn(
              'shrink-0 font-display tracking-tight text-ink-800 transition-all duration-500 ease-cinema',
              compact ? 'text-[0.9375rem]' : 'text-base sm:text-lg',
            )}
          >
            {trip.title}
          </a>

          {/* Desktop: vollständige Navigation */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                      isActive
                        ? 'text-ink-900'
                        : 'text-ink-400 hover:text-ink-800',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-sand-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 34,
                        }}
                      />
                    ) : null}
                    <span className="relative">{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile: Menü-Schalter */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900/90 text-offwhite transition-colors duration-300 hover:bg-ink-800 md:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-cinema',
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-cinema',
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>

          {/* Desktop: dekorativer Reisezeitraum */}
          <span
            className={cn(
              'hidden shrink-0 items-center rounded-full bg-ink-900/90 px-4 py-2 text-[0.6875rem] font-medium tracking-wide text-sand-100 transition-all duration-500 ease-cinema md:inline-flex',
              compact && 'opacity-0',
            )}
            aria-hidden={compact}
          >
            2026
          </span>
        </nav>
      </header>

      {/* Mobile: Vollbild-Menü */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-offwhite/92 backdrop-blur-2xl md:hidden"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex h-full flex-col justify-center px-8 pb-16 pt-24"
            >
              <ul className="flex flex-col gap-1">
                {sections.map((section, index) => {
                  const isActive = activeId === section.id;
                  return (
                    <motion.li
                      key={section.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.05 + index * 0.045,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <a
                        href={`#${section.id}`}
                        onClick={closeMenu}
                        aria-current={isActive ? 'true' : undefined}
                        className="flex items-baseline gap-4 border-b border-sand-300/50 py-4"
                      >
                        <span
                          className={cn(
                            'eyebrow w-6 shrink-0',
                            isActive ? 'text-terracotta-500' : 'text-sand-500',
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'font-display text-3xl transition-colors',
                            isActive ? 'text-terracotta-600' : 'text-ink-800',
                          )}
                        >
                          {section.label}
                        </span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <p className="mt-10 text-sm font-light text-ink-400">
                {trip.period}
                <span className="mx-2 text-sand-400" aria-hidden="true">
                  ·
                </span>
                {trip.region}
              </p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
