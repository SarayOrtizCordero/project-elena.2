"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { workouts, type MealItem } from "./data";
import { mondayKey } from "./menu";

export type Role = "client" | "coach";
export type LoggedFood = MealItem;
export type WeightEntry = { date: string; kg: number };
/** Una serie registrada: peso usado y repeticiones (o segundos). */
export type SetLog = { kg: number; reps: number };
export type SetList = (SetLog | null)[];

/** La clienta de la demo (la app de cliente es la suya). */
export const DEMO_CLIENT = "lucia";

export const countSets = (list?: SetList) => list?.filter(Boolean).length ?? 0;

export const dayKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function seedWeights(): WeightEntry[] {
  const kgs = [68.6, 68.1, 67.9, 67.2, 66.8, 66.5, 66.1, 65.6, 65.3];
  const now = new Date();
  return kgs.map((kg, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 3 - 7 * (kgs.length - 1 - i));
    return { date: dayKey(d), kg };
  });
}

/** Historial de ejemplo: solo los dos primeros ejercicios de cada rutina; el resto aún no se ha estrenado. */
function seedLogs(): Record<string, SetList> {
  const out: Record<string, SetList> = {};
  for (const daysAgo of [14, 7]) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    for (const w of workouts) {
      for (const ex of w.exercises.slice(0, 2)) {
        const kg = Math.max(0, ex.kg - (daysAgo === 14 ? 2 : 0));
        const reps = parseInt(ex.reps, 10);
        out[`${dayKey(d)}:${ex.id}`] = Array.from({ length: ex.sets }, (_, i) => ({ kg, reps: i === ex.sets - 1 ? reps - 1 : reps }));
      }
    }
  }
  return out;
}

type State = {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;

  /** `${fecha}:${ejercicio}` → series registradas (peso y repeticiones) */
  logs: Record<string, SetList>;
  saveSet: (key: string, index: number, set: SetLog | null) => void;

  /** `${clienta}:${ejercicio}` → peso inicial puesto por Elena */
  startKg: Record<string, number>;
  setStartKg: (key: string, kg: number) => void;

  /** Lunes en que empezó el plan de comidas (marca la "Semana 1") */
  planStart: string;
  /** `${semana}:${día}:${ingrediente}` → ya comprado */
  bought: Record<string, boolean>;
  setBought: (keys: string[], value: boolean) => void;

  /** `${fecha}:${itemId}` → comido */
  eaten: Record<string, boolean>;
  toggleEaten: (key: string) => void;

  /** fecha → alimentos añadidos por el cliente */
  extra: Record<string, LoggedFood[]>;
  addFood: (date: string, food: Omit<LoggedFood, "id">) => void;
  removeFood: (date: string, id: string) => void;

  weights: WeightEntry[];
  addWeight: (kg: number) => void;

  reset: () => void;
};

const initial = () => ({
  role: null as Role | null,
  logs: seedLogs(),
  startKg: {} as Record<string, number>,
  planStart: mondayKey(),
  bought: {} as Record<string, boolean>,
  eaten: {} as Record<string, boolean>,
  extra: {} as Record<string, LoggedFood[]>,
  weights: seedWeights(),
});

export const useApp = create<State>()(
  persist(
    (set) => ({
      ...initial(),
      login: (role) => set({ role }),
      logout: () => set({ role: null }),
      saveSet: (key, index, value) =>
        set((s) => {
          const list: SetList = [...(s.logs[key] ?? [])];
          for (let i = 0; i < index; i++) list[i] ??= null;
          list[index] = value;
          return { logs: { ...s.logs, [key]: list } };
        }),
      setStartKg: (key, kg) => set((s) => ({ startKg: { ...s.startKg, [key]: kg } })),
      setBought: (keys, value) =>
        set((s) => ({ bought: { ...s.bought, ...Object.fromEntries(keys.map((k) => [k, value])) } })),
      toggleEaten: (key) => set((s) => ({ eaten: { ...s.eaten, [key]: !s.eaten[key] } })),
      addFood: (date, food) =>
        set((s) => ({
          extra: {
            ...s.extra,
            [date]: [...(s.extra[date] ?? []), { ...food, id: `x-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }],
          },
        })),
      removeFood: (date, id) =>
        set((s) => ({ extra: { ...s.extra, [date]: (s.extra[date] ?? []).filter((f) => f.id !== id) } })),
      addWeight: (kg) =>
        set((s) => {
          const date = dayKey();
          const rest = s.weights.filter((w) => w.date !== date);
          return { weights: [...rest, { date, kg }].sort((a, b) => a.date.localeCompare(b.date)) };
        }),
      reset: () => set({ ...initial() }),
    }),
    { name: "elena-fit-demo-v2", storage: createJSONStorage(() => localStorage) },
  ),
);
