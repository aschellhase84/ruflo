'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Photo } from '@/components/ui/photo';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { TripImage } from '@/data/trip-data';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  image: TripImage;
  sizes: string;
  /** Stärke des Effekts in Prozent der Bildhöhe. 0 = aus. */
  strength?: number;
  /** Zusätzliche Skalierung, damit beim Verschieben keine Kanten entstehen. */
  scale?: number;
  priority?: boolean;
  className?: string;
  /** Klassen für das Bild selbst (z. B. Graustufen-Hover). */
  imageClassName?: string;
  quality?: number;
}

/**
 * Bild mit sanfter Scroll-Parallaxe.
 *
 * Animiert wird ausschließlich `transform` auf einer eigenen Ebene — das läuft
 * im Compositor und erzeugt keine Layout-Arbeit. Der Container muss `relative`
 * sein und `overflow-hidden` gesetzt haben (macht die Komponente selbst).
 */
export function ParallaxImage({
  image,
  sizes,
  strength = 12,
  scale = 1.2,
  priority = false,
  className,
  imageClassName,
  quality,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  const active = !reduced && strength > 0;

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={
          active
            ? { y, scale, willChange: 'transform' }
            : undefined
        }
      >
        <Photo
          image={image}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={imageClassName}
        />
      </motion.div>
    </div>
  );
}
