import Image from 'next/image';

import { toneBlurData } from '@/data/image-tones';
import type { TripImage } from '@/data/trip-data';
import { cn } from '@/lib/utils';

interface PhotoProps {
  image: TripImage;
  /** `sizes` für next/image — bitte immer setzen (siehe lib/utils → imageSizes). */
  sizes: string;
  /** Nur für das erste sichtbare Bild (Hero) auf `true` setzen. */
  priority?: boolean;
  className?: string;
  quality?: number;
  /**
   * Wenn false, wird das Bild mit seinen echten Maßen gerendert statt
   * die Elternfläche zu füllen. Standard: füllen.
   */
  fill?: boolean;
}

/**
 * Einheitlicher Bild-Baustein der ganzen Seite.
 *
 * Kümmert sich um: next/image, Blur-Placeholder aus der Farbwelt,
 * object-position aus den Reisedaten und sinnvolle Default-Klassen.
 * Der Eltern-Container muss `relative` und eine Höhe/Aspect-Ratio haben.
 */
export function Photo({
  image,
  sizes,
  priority = false,
  className,
  quality = 82,
  fill = true,
}: PhotoProps) {
  // `alt` wird bewusst separat übergeben (nicht über den Spread), damit die
  // jsx-a11y-Regel es statisch erkennt.
  const shared = {
    src: image.src,
    sizes,
    priority,
    quality,
    placeholder: 'blur' as const,
    blurDataURL: toneBlurData[image.tone],
    style: { objectPosition: image.position ?? 'center' },
    // Bilder außerhalb des Viewports erst laden, wenn sie gebraucht werden.
    loading: priority ? ('eager' as const) : ('lazy' as const),
    // Ohne dies startet der Browser beim Ziehen ein natives Bild-Drag und
    // schluckt die Pointer-Events — die Wischgeste in der Lightbox und das
    // Wischen in den horizontalen Bereichen würden nicht mehr ankommen.
    draggable: false,
  };

  if (!fill) {
    return (
      <Image
        {...shared}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={cn('h-auto w-full object-cover', className)}
      />
    );
  }

  return (
    <Image
      {...shared}
      alt={image.alt}
      fill
      className={cn('object-cover', className)}
    />
  );
}
