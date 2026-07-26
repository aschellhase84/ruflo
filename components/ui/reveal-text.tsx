'use client';

import { motion } from 'framer-motion';

import { MOTION_TAGS, type MotionTag } from '@/components/ui/motion-tags';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  text: string;
  className?: string;
  /** Für `aria-labelledby` am umgebenden Abschnitt. */
  id?: string;
  as?: Extract<MotionTag, 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote'>;
  /** Verzögerung in Sekunden, bevor das erste Wort startet. */
  delay?: number;
  /** Abstand zwischen den Wörtern. */
  gap?: number;
  /** Beim Mount statt beim Scrollen starten (für den Hero). */
  immediate?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Split-Text-Reveal: Die Wörter steigen einzeln aus einer Maske nach oben.
 *
 * Barrierearmut: Der vollständige Satz steht einmal als normaler Text im DOM
 * (`sr-only`), die animierte Fassung ist `aria-hidden`. Screenreader lesen
 * also immer einen sauberen, ungeteilten Satz.
 */
export function RevealText({
  text,
  className,
  id,
  as = 'h2',
  delay = 0,
  gap = 0.055,
  immediate = false,
}: RevealTextProps) {
  const Tag = MOTION_TAGS[as];
  const words = text.split(' ');

  const activation = immediate
    ? { animate: 'shown' as const }
    : {
        whileInView: 'shown' as const,
        viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
      };

  return (
    <Tag
      id={id}
      className={cn(className)}
      initial="hidden"
      {...activation}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          // Der Umbruch findet zwischen diesen Spans statt — die Maske selbst
          // bleibt dadurch immer genau ein Wort breit.
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: '110%' },
                shown: { y: '0%' },
              }}
              transition={{ duration: 0.95, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        )).reduce<React.ReactNode[]>(
          (acc, node, index) => (index === 0 ? [node] : [...acc, ' ', node]),
          [],
        )}
      </span>
    </Tag>
  );
}
