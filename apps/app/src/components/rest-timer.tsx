"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Timer, X } from "lucide-react";
import { restLeft } from "@/lib/rest";
import { useApp } from "@/lib/store";
import { useToast } from "./toast";

/** Si el descanso acabó hace más de esto (app cerrada mucho rato), se quita sin avisar. */
const STALE_MS = 5 * 60_000;

/** Temporizador de descanso. Vive en el marco de la app para que siga a la vista en cualquier pantalla. */
export function RestTimer() {
  const rest = useApp((s) => s.rest);
  const stopRest = useApp((s) => s.stopRest);
  const toast = useToast((s) => s.show);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!rest) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (restLeft(rest, t) > 0) return;
      stopRest();
      if (t - rest.endsAt < STALE_MS) {
        navigator.vibrate?.([200, 100, 200]);
        toast("Descanso terminado: a por la siguiente serie");
      }
    };
    tick();
    const id = setInterval(tick, 250);
    // Al volver a la app se actualiza al momento
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [rest, stopRest, toast]);

  const left = rest ? Math.min(rest.total, restLeft(rest, now)) : 0;

  return (
    <AnimatePresence>
      {rest && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          role="timer"
          aria-label="Descanso"
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md overflow-hidden glass-strong rounded-3xl !border-highlight shadow-2xl lg:bottom-8 lg:left-auto lg:right-8"
        >
          <div className="flex items-center gap-4 p-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-on-accent">
              <Timer className="size-6" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">Descanso · {rest.name}</p>
              <p className="font-display text-4xl leading-none tabular-nums">
                {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
              </p>
            </div>
            <button
              onClick={stopRest}
              aria-label="Saltar descanso"
              className="grid size-10 place-items-center rounded-full border border-line text-muted hover:text-fg"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="h-1 bg-canvas">
            <div className="h-full bg-highlight transition-[width] duration-300 ease-linear" style={{ width: `${(left / rest.total) * 100}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
