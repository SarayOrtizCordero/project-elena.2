"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false en servidor y primer render de hidratación; true después. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function longDate(d = new Date()) {
  const s = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}
