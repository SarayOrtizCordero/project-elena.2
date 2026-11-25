"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MealItem } from "./data";

export type Role = "client" | "coach";
export type LoggedFood = MealItem;
export type WeightEntry = { date: string; kg: number };

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

type State = {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;

  /** `${fecha}:${ejercicio}` → series completadas */
  sets: Record<string, number>;
  setSets: (key: string, n: number) => void;

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
  sets: {} as Record<string, number>,
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
      setSets: (key, n) => set((s) => ({ sets: { ...s.sets, [key]: Math.max(0, n) } })),
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
    { name: "elena-fit-demo-v1", storage: createJSONStorage(() => localStorage) },
  ),
);
