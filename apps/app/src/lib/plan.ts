// Rutina de cada clienta y plantillas reutilizables.
import { targets as baseTargets, weekPlan, workouts, type Exercise, type Workout } from "./data";

export type ClientPlan = { days: (string | null)[]; workouts: Workout[] };
export type Targets = typeof baseTargets;

export type Template =
  | { id: string; kind: "Rutina"; name: string; plan: ClientPlan }
  | { id: string; kind: "Comidas"; name: string; targets: Targets };

export const defaultPlan: ClientPlan = { days: weekPlan, workouts };

/** Todos los ejercicios conocidos, para añadirlos a una rutina. */
export const exerciseCatalog: Exercise[] = workouts.flatMap((w) => w.exercises);

export const clonePlan = (plan: ClientPlan): ClientPlan => ({
  days: [...plan.days],
  workouts: plan.workouts.map((w) => ({ ...w, exercises: w.exercises.map((e) => ({ ...e })) })),
});

const focusOf = (exercises: Exercise[]) => [...new Set(exercises.map((e) => e.muscle))].slice(0, 3).join(" · ");

function routine(id: string, title: string, ids: string[], days: number[]): { workout: Workout; days: number[] } {
  const exercises = ids.map((x) => ({ ...exerciseCatalog.find((e) => e.id === x)! }));
  return { workout: { id, title, focus: focusOf(exercises), minutes: 45 + exercises.length * 2, exercises }, days };
}

function planFrom(parts: ReturnType<typeof routine>[]): ClientPlan {
  const days: (string | null)[] = Array(7).fill(null);
  for (const p of parts) for (const d of p.days) days[d] = p.workout.id;
  return { days, workouts: parts.map((p) => p.workout) };
}

export const seedTemplates = (): Template[] => [
  { id: "t1", kind: "Rutina", name: "Empuje / Tirón / Pierna · 4 días", plan: clonePlan(defaultPlan) },
  {
    id: "t2",
    kind: "Rutina",
    name: "Full body principiantes · 3 días",
    plan: planFrom([routine("full", "Full body", ["lower-1", "push-1", "pull-1", "glute-1", "lower-5"], [0, 2, 4])]),
  },
  {
    id: "t3",
    kind: "Rutina",
    name: "Glúteo y pierna · 3 días",
    plan: planFrom([
      routine("glute", "Glúteo", ["glute-1", "glute-2", "glute-3", "glute-4"], [0, 4]),
      routine("lower", "Pierna", ["lower-1", "lower-2", "lower-3", "lower-4"], [2]),
    ]),
  },
  { id: "t4", kind: "Comidas", name: "Definición · 1.800 kcal", targets: { kcal: 1800, p: 135, c: 170, f: 60 } },
  { id: "t5", kind: "Comidas", name: "Mantenimiento · 2.100 kcal", targets: { kcal: 2100, p: 130, c: 235, f: 70 } },
  { id: "t6", kind: "Comidas", name: "Volumen limpio · 2.600 kcal", targets: { kcal: 2600, p: 150, c: 320, f: 80 } },
];
