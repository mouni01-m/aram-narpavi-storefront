"use client";

import { domAnimation, LazyMotion, m, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Gentle fade-up the first time a block enters the viewport. Reduced motion keeps only the fade. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
