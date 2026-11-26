"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@elena/ui";
import { workouts } from "@/lib/data";
import { shortDate } from "@/lib/hooks";
import { sessionsOf, setText } from "@/lib/sessions";
import { DEMO_CLIENT, useApp } from "@/lib/store";
import { Stepper } from "./stepper";

/**
 * Cargas de una clienta, vista por Elena. Antes del primer registro Elena fija el peso inicial;
 * a partir de ahí lo apunta la clienta y Elena solo lo consulta.
 */
export function ClientLoads({ clientId, firstName }: { clientId: string; firstName: string }) {
  const [selected, setSelected] = useState(workouts[0].id);
  const workout = workouts.find((w) => w.id === selected) ?? workouts[0];
  const logs = useApp((s) => s.logs);
  const startKg = useApp((s) => s.startKg);
  const setStartKg = useApp((s) => s.setStartKg);

  return (
    <section className="rounded-3xl border border-line bg-ink-2 p-5" aria-label="Pesos por ejercicio">
      <h2 className="font-display-tight text-3xl font-bold">Pesos por ejercicio</h2>
      <p className="mt-1 text-sm text-mute">
        Pon el peso de la primera vez. Desde su primer registro, lo actualiza {firstName}.
      </p>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Rutina">
        {workouts.map((w) => (
          <button
            key={w.id}
            type="button"
            aria-pressed={w.id === selected}
            onClick={() => setSelected(w.id)}
            className={cn(
              "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
              w.id === selected ? "border-volt bg-volt text-ink" : "border-line text-mute hover:text-bone",
            )}
          >
            {w.title}
          </button>
        ))}
      </div>

      <ul className="mt-3 divide-y divide-line">
        {workout.exercises.map((ex) => {
          // En la demo solo hay registros reales de una clienta
          const last = clientId === DEMO_CLIENT ? sessionsOf(logs, ex.id)[0] : undefined;
          const key = `${clientId}:${ex.id}`;
          return (
            <li key={ex.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold">{ex.name}</p>
                <p className="text-xs text-mute">
                  {ex.muscle} · {ex.sets} × {ex.reps}
                </p>
                {last && (
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-volt">{shortDate(last.date)}:</span>{" "}
                    {last.sets.map((s) => setText(s, ex)).join(" · ")}
                  </p>
                )}
              </div>
              {last ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-ink-3 px-3 py-1.5 text-xs font-semibold text-mute sm:self-center">
                  <Lock className="size-3.5" aria-hidden /> Lo registra {firstName}
                </span>
              ) : (
                <Stepper
                  key={key}
                  label="Peso inicial (kg)"
                  value={startKg[key] ?? ex.kg}
                  onChange={(kg) => setStartKg(key, kg)}
                  decimal
                  className="w-44 shrink-0"
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
