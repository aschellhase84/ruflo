'use client';

import { useEffect, useState } from 'react';

/**
 * Liest `prefers-reduced-motion` und reagiert live auf Änderungen.
 *
 * Startwert ist bewusst `false`, damit Server- und erstes Client-Rendering
 * identisch sind (keine Hydration-Warnung). Direkt nach dem Mount wird der
 * echte Wert übernommen — vor dem ersten Scroll-Trigger.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/**
 * True, sobald der Viewport mindestens Tablet-Breite hat.
 * Wird genutzt, um aufwendige Effekte (Maus-Parallax, Tilt) auf Mobile
 * gar nicht erst zu aktivieren.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return fine;
}
