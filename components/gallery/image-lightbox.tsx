'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Photo } from '@/components/ui/photo';
import type { GalleryItem } from '@/data/trip-data';

interface ImageLightboxProps {
  items: GalleryItem[];
  /** Index des offenen Bildes, `null` = geschlossen. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const SWIPE_THRESHOLD = 70;

/**
 * Lightbox für die Highlights-Galerie.
 *
 * Bedienung:
 * - Tastatur: ← → blättern, Escape schließt, Tab bleibt im Dialog
 * - Touch: horizontal wischen
 * - Maus: Schaltflächen, Klick auf den Hintergrund schließt
 *
 * Wird per Portal an <body> gehängt — sonst würde `position: fixed` an den
 * transformierten Eltern-Elementen der Animationen hängen bleiben.
 */
export function ImageLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const isOpen = index !== null;
  const total = items.length;

  useEffect(() => setMounted(true), []);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + total) % total);
  }, [index, onNavigate, total]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % total);
  }, [index, onNavigate, total]);

  // Tastatursteuerung + Scroll-Sperre + Fokusverwaltung
  useEffect(() => {
    if (!isOpen) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key !== 'Tab') return;

      // Einfache Fokusfalle: Tab zirkuliert innerhalb des Dialogs.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    // Nach der Öffnungsanimation den Schließen-Button fokussieren.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      lastFocused.current?.focus?.();
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  if (!mounted) return null;

  const item = index === null ? null : items[index];

  return createPortal(
    <AnimatePresence>
      {item ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Bild ${(index ?? 0) + 1} von ${total}: ${item.caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-md"
        >
          {/* Klick auf den Hintergrund schließt — die Fläche ist für
              Screenreader unsichtbar, es gibt einen echten Button darüber. */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          <header className="relative flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-6">
            <p className="eyebrow text-sand-300/70">
              {String((index ?? 0) + 1).padStart(2, '0')}
              <span className="mx-2 text-white/25">/</span>
              {String(total).padStart(2, '0')}
            </p>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Bildansicht schließen"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-offwhite transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
            <AnimatePresence mode="wait">
              <motion.figure
                key={item.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={onDragEnd}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.42, ease: EASE }}
                className="flex max-h-full w-full max-w-5xl cursor-grab flex-col items-center active:cursor-grabbing"
              >
                <div className="relative max-h-[68svh] w-full overflow-hidden rounded-2xl">
                  <Photo
                    image={item.image}
                    sizes="(max-width: 767px) 92vw, 80vw"
                    fill={false}
                    priority
                    quality={90}
                    className="max-h-[68svh] w-full object-contain"
                  />
                </div>
                <figcaption className="mt-5 max-w-xl px-2 text-center text-sm font-light text-sand-200/80">
                  {item.caption}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Blättern — auf Mobile unterhalb, auf Desktop an den Seiten */}
            <LightboxArrow direction="prev" onClick={goPrev} />
            <LightboxArrow direction="next" onClick={goNext} />
          </div>

          <footer className="relative flex items-center justify-center gap-3 px-5 pb-6 pt-4 sm:hidden">
            <LightboxArrow direction="prev" onClick={goPrev} inline />
            <LightboxArrow direction="next" onClick={goNext} inline />
          </footer>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function LightboxArrow({
  direction,
  onClick,
  inline = false,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  inline?: boolean;
}) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Vorheriges Bild' : 'Nächstes Bild'}
      className={
        inline
          ? 'flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-offwhite transition-colors hover:bg-white/10'
          : `absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-offwhite transition-colors duration-300 hover:border-white/60 hover:bg-white/10 sm:flex ${
              isPrev ? 'left-3 lg:left-8' : 'right-3 lg:right-8'
            }`
      }
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`h-4 w-4 ${isPrev ? 'rotate-180' : ''}`}
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
