'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Sichtbare fokussierbare Elemente innerhalb der übergebenen Container.
 *
 * Der Sichtbarkeitsfilter ist entscheidend: Die Bedienelemente der Lightbox
 * und der Navigation existieren teils doppelt (einmal für Mobile, einmal für
 * Desktop) und werden per `sm:hidden` / `md:hidden` ein- und ausgeblendet.
 * Ein `display: none`-Element ist nicht fokussierbar — würde es trotzdem als
 * erstes oder letztes Element der Liste gelten, liefe der Tab-Umlauf ins
 * Leere und der Fokus verließe den Dialog.
 *
 * `getClientRects()` ist dafür der zuverlässige Test: leer bei `display: none`
 * und bei Elementen, die gar nicht im Layout hängen.
 */
export function getVisibleFocusables(
  ...roots: (HTMLElement | null | undefined)[]
): HTMLElement[] {
  const found: HTMLElement[] = [];

  for (const root of roots) {
    if (!root) continue;
    root
      .querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      .forEach((el) => {
        if (el.getClientRects().length > 0) found.push(el);
      });
  }

  return found;
}

interface FocusTrapOptions {
  /** Trap nur aktiv, solange das Overlay offen ist. */
  active: boolean;
  /**
   * Bereiche, die den Fokus behalten sollen. Mehrere sind möglich, weil
   * z. B. der Menü-Schalter im Header sitzt, die Menüpunkte aber im Overlay.
   * Die Reihenfolge folgt der DOM-Reihenfolge der Container.
   */
  containers: RefObject<HTMLElement>[];
  onEscape: () => void;
  /** Element, das beim Öffnen den Fokus bekommt. Sonst das erste sichtbare. */
  initialFocus?: RefObject<HTMLElement>;
}

/**
 * Hält den Tastaturfokus in einem Overlay fest, sperrt den Seiten-Scroll und
 * gibt den Fokus beim Schließen an das auslösende Element zurück.
 */
export function useFocusTrap({
  active,
  containers,
  onEscape,
  initialFocus,
}: FocusTrapOptions) {
  // Die Container-Liste darf bei jedem Render neu erzeugt werden, ohne den
  // Effekt neu aufzusetzen — gelesen wird sie erst beim Tastendruck.
  const containersRef = useRef(containers);
  containersRef.current = containers;

  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const nodes = () =>
      getVisibleFocusables(...containersRef.current.map((ref) => ref.current));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = nodes();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      // Fokus außerhalb (z. B. noch am Auslöser) → zurück in den Dialog holen.
      if (!current || !focusables.includes(current as HTMLElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Erst nach der Öffnungsanimation fokussieren, sonst springt das Layout.
    const focusTimer = window.setTimeout(() => {
      const target = initialFocus?.current ?? nodes()[0];
      target?.focus();
    }, 80);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [active, onEscape, initialFocus]);
}
