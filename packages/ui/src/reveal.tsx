"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type From = "up" | "down" | "left" | "right" | "scale";
type Tag = "div" | "li" | "p" | "span" | "section" | "article";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Distancia del desplazamiento inicial en px. */
  y?: number;
  /** Dirección desde la que aparece. */
  from?: From;
  as?: Tag;
  className?: string;
};

function initialFor(from: From, d: number) {
  switch (from) {
    case "down":
      return { opacity: 0, y: -d };
    case "left":
      return { opacity: 0, x: -d };
    case "right":
      return { opacity: 0, x: d };
    case "scale":
      return { opacity: 0, scale: 0.9 };
    default:
      return { opacity: 0, y: d };
  }
}

/** Aparece al entrar en pantalla al hacer scroll. Respeta prefers-reduced-motion vía MotionConfig. */
export function Reveal({ children, delay = 0, y = 24, from = "up", as = "div", className }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={initialFor(from, y)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
