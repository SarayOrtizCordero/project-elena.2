import type { Exercise } from "./data";
import type { SetList, SetLog } from "./store";
import { fmtNum } from "@/components/stepper";

export type Session = { date: string; sets: SetLog[] };

/** Sesiones registradas de un ejercicio, de la más reciente a la más antigua. */
export function sessionsOf(logs: Record<string, SetList>, exerciseId: string): Session[] {
  return Object.entries(logs)
    .filter(([key]) => key.endsWith(`:${exerciseId}`))
    .map(([key, list]) => ({ date: key.split(":")[0], sets: list.filter((s): s is SetLog => !!s) }))
    .filter((s) => s.sets.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const isTimed = (ex: Exercise) => ex.reps.endsWith("s");

export function setText(set: SetLog, ex: Exercise) {
  const reps = isTimed(ex) ? `${set.reps} s` : `${set.reps} reps`;
  return set.kg > 0 ? `${fmtNum(set.kg)} kg × ${reps}` : reps;
}

/**
 * Valores con los que se abre una serie, para que casi siempre baste con confirmar:
 * 1) lo que acabas de hacer hoy, 2) la última vez, 3) el peso inicial que puso Elena.
 */
export function suggestion(ex: Exercise, index: number, today: SetList, last: Session | undefined, startKg: number): SetLog {
  for (let i = index - 1; i >= 0; i--) {
    const prev = today[i];
    if (prev) return { ...prev };
  }
  if (last) return { ...last.sets[Math.min(index, last.sets.length - 1)] };
  return { kg: startKg, reps: parseInt(ex.reps, 10) };
}
