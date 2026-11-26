"use client";

import { useMemo } from "react";
import { targets as baseTargets, type Workout } from "./data";
import { planForDate } from "./menu";
import type { ClientPlan } from "./plan";
import { DEMO_CLIENT, countSets, dayKey, useApp } from "./store";

export function useTotals(date: string = dayKey()) {
  const eaten = useApp((s) => s.eaten);
  const extra = useApp((s) => s.extra[date]);
  const planStart = useApp((s) => s.planStart);
  return useMemo(() => {
    const t = { kcal: 0, p: 0, c: 0, f: 0 };
    for (const meal of planForDate(date, planStart).meals) {
      for (const it of meal.items) {
        if (eaten[`${date}:${it.id}`]) {
          t.kcal += it.kcal;
          t.p += it.p;
          t.c += it.c;
          t.f += it.f;
        }
      }
    }
    for (const it of extra ?? []) {
      t.kcal += it.kcal;
      t.p += it.p;
      t.c += it.c;
      t.f += it.f;
    }
    return t;
  }, [eaten, extra, date, planStart]);
}

export function useWorkoutProgress(workout: Workout, date: string = dayKey()) {
  const logs = useApp((s) => s.logs);
  return useMemo(() => {
    const total = workout.exercises.reduce((a, e) => a + e.sets, 0);
    const done = workout.exercises.reduce((a, e) => a + Math.min(e.sets, countSets(logs[`${date}:${e.id}`])), 0);
    return { total, done, pct: total ? done / total : 0 };
  }, [logs, workout, date]);
}

/** Rutina que toca hoy (o la primera si es día de descanso). */
export function todaysWorkout(plan: ClientPlan) {
  const id = plan.days[(new Date().getDay() + 6) % 7];
  return { workout: plan.workouts.find((w) => w.id === id) ?? plan.workouts[0], rest: !id };
}

/** Objetivos de comida de la clienta (los de la plantilla que le haya asignado Elena). */
export const useTargets = (clientId: string = DEMO_CLIENT) => useApp((s) => s.targetsBy[clientId]) ?? baseTargets;
