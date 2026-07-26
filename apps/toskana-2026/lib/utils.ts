import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-Klassen zusammenführen, Konflikte gewinnt die spätere Klasse. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standard-`sizes`-Werte für next/image.
 * Verhindert, dass auf dem iPhone unnötig große Bilddateien geladen werden.
 */
export const imageSizes = {
  /** Vollbild-Bereiche (Hero, Panorama, Abschluss) */
  full: '100vw',
  /** Halbe Breite ab Tablet */
  half: '(max-width: 767px) 100vw, 50vw',
  /** Drittel ab Desktop */
  third: '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw',
  /** Karten in horizontalen Bereichen */
  card: '(max-width: 767px) 78vw, (max-width: 1279px) 42vw, 30vw',
  /** Kleine Vorschaubilder in der Timeline */
  thumb: '(max-width: 767px) 40vw, 20vw',
} as const;
