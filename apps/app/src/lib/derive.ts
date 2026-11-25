"use client";

import { useMemo } from "react";
import { mealPlan, workouts, type Workout } from "./data";
import { dayKey, useApp } from "./store";

export function useTotals(date: string = dayKey()) {
  const eaten = useApp((s) => s.eaten);
  const extra = useApp((s) => s.extra[date]);
  return useMemo(() => {
    const t = { kcal: 0, p: 0, c: 0, f: 0 };
    for (const meal of mealPlan) {
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
  }, [eaten, extra, date]);
}

export function useWorkoutProgress(workout: Workout, date: string = dayKey()) {
  const sets = useApp((s) => s.sets);
  return useMemo(() => {
    const total = workout.exercises.reduce((a, e) => a + e.sets, 0);
    const done = workout.exercises.reduce((a, e) => a + Math.min(e.sets, sets[`${date}:${e.id}`] ?? 0), 0);
    return { total, done, pct: total ? done / total : 0 };
  }, [sets, workout, date]);
}

/** Rutina que toca hoy (o la primera si es día de descanso). */
export function todaysWorkout() {
  const idx = (new Date().getDay() + 6) % 7;
  const id = ["push", "lower", null, "pull", "glute", null, null][idx];
  return { workout: workouts.find((w) => w.id === id) ?? workouts[0], rest: id === null };
}
