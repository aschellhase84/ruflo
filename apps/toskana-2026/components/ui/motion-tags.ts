'use client';

import { motion } from 'framer-motion';

/**
 * Statische Zuordnung Tag → Motion-Komponente.
 *
 * Wichtig: `motion(tag)` NICHT im Render aufrufen — das erzeugt bei jedem
 * Durchlauf einen neuen Komponententyp, React würde den Teilbaum jedes Mal
 * neu mounten (Animationen brechen ab, unnötige DOM-Arbeit).
 */
export const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  figure: motion.figure,
  figcaption: motion.figcaption,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  blockquote: motion.blockquote,
} as const;

export type MotionTag = keyof typeof MOTION_TAGS;
