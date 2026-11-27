"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Desactiva animaciones de movimiento si el usuario lo pide en su sistema. */
export function MotionProvider({ children }: { children: ReactNode }) {
  // Avisa al script de seguridad (layout) de que la página ya funciona.
  useEffect(() => {
    (window as unknown as { __elenaReady?: boolean }).__elenaReady = true;
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

