'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// The server output is visible. Motion is progressive enhancement, never a gate to the story.
export function Reveal({ children, className = '', variant = 0 }: { children: ReactNode; className?: string; variant?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false}
    whileInView={reduced ? undefined : { y: [variant % 2 ? 18 : 26, 0], opacity: [0.35, 1], rotate: variant === 3 ? [-1.2, 0] : [0, 0] }}
    viewport={{ once: true, amount: 0.12 }} transition={{ duration: 1.15, ease: [0.2, 0.65, 0.3, 1] }}>
    {children}
  </motion.div>;
}
