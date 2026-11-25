"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Desactiva animaciones de movimiento si el usuario lo pide en su sistema. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
