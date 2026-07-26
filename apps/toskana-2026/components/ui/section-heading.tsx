import type { ReactNode } from 'react';

import { Reveal } from '@/components/ui/reveal';
import { RevealText } from '@/components/ui/reveal-text';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Kleines Kapitel-Label über der Überschrift. */
  chapter?: string;
  title: string;
  /** ID der Überschrift — für `aria-labelledby` am Abschnitt. */
  titleId?: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'center';
  /** Helle Typografie für dunkle Abschnitte. */
  tone?: 'dark' | 'light';
  as?: 'h2' | 'h3';
}

/** Einheitlicher Abschnittskopf: Label, große Serifen-Überschrift, Lead. */
export function SectionHeading({
  chapter,
  title,
  titleId,
  lead,
  children,
  className,
  align = 'left',
  tone = 'dark',
  as = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const light = tone === 'light';

  return (
    <div
      className={cn(
        'flex flex-col',
        centered && 'items-center text-center',
        className,
      )}
    >
      {chapter ? (
        <Reveal variant="fade" duration={0.9}>
          <span
            className={cn(
              'eyebrow inline-flex items-center gap-3',
              light ? 'text-sand-300/80' : 'text-terracotta-600',
            )}
          >
            <span
              className={cn(
                'h-px w-8',
                light ? 'bg-sand-300/50' : 'bg-terracotta-500/45',
              )}
              aria-hidden="true"
            />
            {chapter}
          </span>
        </Reveal>
      ) : null}

      <RevealText
        as={as}
        id={titleId}
        text={title}
        delay={chapter ? 0.08 : 0}
        className={cn(
          'display-lg mt-5 font-display',
          light ? 'text-offwhite' : 'text-ink-800',
        )}
      />

      {lead ? (
        <Reveal variant="up" delay={0.16} duration={0.9}>
          <p
            className={cn(
              'lede mt-7 max-w-prose font-light',
              centered && 'mx-auto',
              light ? 'text-sand-200/85' : 'text-ink-400',
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}

      {children}
    </div>
  );
}
