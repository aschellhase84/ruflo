'use client';

import { useEffect, useState } from 'react';

/**
 * Scroll Spy über IntersectionObserver — bewusst OHNE Scroll-Listener,
 * damit der Main Thread beim Scrollen frei bleibt.
 *
 * Der `rootMargin` spannt ein schmales Band knapp oberhalb der Bildschirmmitte
 * auf. Aktiv ist der Abschnitt, der dieses Band gerade schneidet. Schneidet
 * kurzzeitig keiner (kurze Abschnitte, Übergänge), bleibt der letzte aktiv —
 * das verhindert Flackern in der Navigation.
 *
 * @param ids Section-IDs in Dokumentreihenfolge
 */
export function useScrollSpy(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Bei mehreren Treffern gewinnt der weiter unten liegende Abschnitt.
        const next = [...ids].reverse().find((id) => visible.has(id));
        if (next) setActiveId(next);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
