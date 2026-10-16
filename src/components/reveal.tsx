"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -32px 0px" });
  const reduced = useReducedMotion();
  // SSR starts fully visible. JS enhances the entrance without hiding content
  // from visitors who disable JavaScript or reduced-motion users.
  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ y: inView || reduced ? 0 : 14 }}
      transition={{ duration: reduced ? 0 : 0.35, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
