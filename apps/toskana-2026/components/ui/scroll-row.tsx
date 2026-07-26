'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

interface ScrollRowProps {
  children: ReactNode;
  /** Beschreibung für Screenreader, z. B. „Bilderstrecke Florenz“. */
  label: string;
  className?: string;
  /** Ausrichtung der Pfeil-Schaltflächen (meist die Seiten-Gutter). */
  controlsClassName?: string;
}

/**
 * Horizontaler Scrollbereich mit Snap.
 *
 * - Mobile: normales Wischen (`overflow-x: auto` + Scroll-Snap)
 * - Desktop: zusätzlich Pfeil-Schaltflächen
 * - Tastatur: Der Bereich ist fokussierbar (`tabIndex=0`), damit die
 *   Pfeiltasten den Inhalt nativ scrollen — Voraussetzung dafür, dass der
 *   Inhalt auch ohne Maus erreichbar ist.
 *
 * Der Scroll-Listener hängt nur am Element selbst und wird über
 * `requestAnimationFrame` entprellt.
 */
export function ScrollRow({
  children,
  label,
  className,
  controlsClassName,
}: ScrollRowProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setEdges({
      start: node.scrollLeft <= 2,
      end: max <= 2 || node.scrollLeft >= max - 2,
    });
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    node.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      node.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  /**
   * Zum nächsten bzw. vorherigen Element springen.
   *
   * Bewusst NICHT `scrollBy(clientWidth * x)`: Bei `scroll-snap-type: mandatory`
   * zieht der Browser eine laufende Smooth-Scroll-Animation auf den nächsten
   * Snap-Punkt zurück — der Sprung bleibt dann auf halber Strecke stecken.
   * Deshalb wird direkt der Snap-Punkt des Zielelements angefahren.
   */
  const step = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;

    const padLeft = parseFloat(getComputedStyle(node).paddingLeft) || 0;
    const base = node.getBoundingClientRect().left;
    const items = Array.from(node.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && !el.hasAttribute('data-spacer'),
    );

    // Position jedes Elements innerhalb des Scrollbereichs
    const offsets = items.map(
      (el) => node.scrollLeft + (el.getBoundingClientRect().left - base) - padLeft,
    );
    const current = node.scrollLeft;

    const target =
      direction === 1
        ? offsets.find((offset) => offset > current + 8)
        : [...offsets].reverse().find((offset) => offset < current - 8);

    node.scrollTo({
      left: target ?? (direction === 1 ? node.scrollWidth : 0),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scroller}
        role="region"
        aria-label={label}
        tabIndex={0}
        // scroll-pl muss dem px entsprechen: `snap-start` richtet sonst am
        // Rand des Scroll-Ports aus und schluckt den linken Seitenabstand.
        className="scroll-row gap-4 px-6 pb-2 scroll-pl-6 sm:gap-6 sm:px-8 sm:scroll-pl-8 lg:px-12 lg:scroll-pl-12"
      >
        {children}
        {/* Endpolster, damit die letzte Karte nicht am Rand klebt */}
        <div data-spacer className="w-2 shrink-0 sm:w-4" aria-hidden="true" />
      </div>

      <div
        className={cn(
          'mt-6 hidden items-center gap-3 md:flex',
          controlsClassName,
        )}
      >
        <RowButton
          direction="prev"
          disabled={edges.start}
          onClick={() => step(-1)}
        />
        <RowButton
          direction="next"
          disabled={edges.end}
          onClick={() => step(1)}
        />
        <span className="ml-2 text-xs font-light text-ink-400">
          Wischen oder Pfeiltasten benutzen
        </span>
      </div>
    </div>
  );
}

function RowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Ein Bild zurück' : 'Ein Bild weiter'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-white/70 text-ink-600 transition-all duration-300 ease-cinema hover:border-ink-800 hover:bg-ink-900 hover:text-offwhite disabled:pointer-events-none disabled:opacity-30"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn('h-4 w-4', isPrev && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
