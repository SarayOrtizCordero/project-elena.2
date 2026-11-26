"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { bonus, canCancel, type Appointment, type Availability, type Pack } from "./agenda";
import { clients, type MealItem } from "./data";
import { mondayKey } from "./menu";
import { clonePlan, defaultPlan, seedTemplates, type ClientPlan, type Targets, type Template } from "./plan";
import type { Rest } from "./rest";
import { seedAppointments, seedAvailability, seedLogs, seedPacks, seedWeights } from "./seed";

export type Role = "client" | "coach";
export type LoggedFood = MealItem;
export type WeightEntry = { date: string; kg: number };
/** Una serie registrada: peso usado y repeticiones (o segundos). */
export type SetLog = { kg: number; reps: number };
export type SetList = (SetLog | null)[];
/** Vídeo subido por Elena. El archivo está en IndexedDB (ver video-files.ts). */
export type CoachVideo = { id: string; title: string; date: string; size: number; clients: string[] };

/** La clienta de la demo (la app de cliente es la suya). */
export const DEMO_CLIENT = "lucia";

export const countSets = (list?: SetList) => list?.filter(Boolean).length ?? 0;

export const dayKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

type State = {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;

  /** `${fecha}:${ejercicio}` → series registradas (peso y repeticiones) */
  logs: Record<string, SetList>;
  saveSet: (key: string, index: number, set: SetLog | null) => void;

  /** Rutina propia de cada clienta; quien no tenga usa la rutina base */
  plans: Record<string, ClientPlan>;
  setPlan: (clientId: string, plan: ClientPlan) => void;
  targetsBy: Record<string, Targets>;
  templates: Template[];
  saveTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
  /** Nombre de la plantilla asignada a cada clienta */
  assigned: Record<string, { Rutina?: string; Comidas?: string }>;
  assignTemplate: (templateId: string, clientId: string) => void;

  appointments: Appointment[];
  packs: Pack[];
  availability: Availability;
  /** Devuelve false si el hueco está ocupado o si la clienta no tiene sesiones libres */
  book: (appointment: Omit<Appointment, "id" | "status" | "unseen">) => boolean;
  cancelAppointment: (id: string, who: Role) => void;
  returnSession: (id: string, returned: boolean) => void;
  markSeen: (clientId: string) => void;
  addPack: (clientId: string, sessions: number) => void;
  removePack: (id: string) => void;
  toggleSlot: (weekday: number, time: string) => void;

  videos: CoachVideo[];
  addVideo: (video: CoachVideo) => void;
  updateVideo: (id: string, patch: Partial<Pick<CoachVideo, "title" | "clients">>) => void;
  removeVideo: (id: string) => void;

  /** Rutina elegida hoy en Entreno (otro día vuelve a salir la que toca) */
  routine: { date: string; id: string } | null;
  setRoutine: (id: string | null) => void;

  /** Descanso en marcha, visible aunque se cambie de pantalla o se cierre la app */
  rest: Rest | null;
  startRest: (name: string, seconds: number) => void;
  stopRest: () => void;

  /** Lunes en que empezó el plan de comidas (marca la "Semana 1") */
  planStart: string;
  /** `${lunes de esa semana}:${día}:${ingrediente}` → ya comprado */
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
  plans: {} as Record<string, ClientPlan>,
  targetsBy: {} as Record<string, Targets>,
  templates: seedTemplates(),
  assigned: {} as Record<string, { Rutina?: string; Comidas?: string }>,
  appointments: seedAppointments(),
  packs: seedPacks(),
  availability: seedAvailability(),
  videos: [] as CoachVideo[],
  routine: null as { date: string; id: string } | null,
  rest: null as Rest | null,
  planStart: mondayKey(),
  bought: {} as Record<string, boolean>,
  eaten: {} as Record<string, boolean>,
  extra: {} as Record<string, LoggedFood[]>,
  weights: seedWeights(),
});

/** Quita de una rutina las referencias a un vídeo borrado. */
const withoutVideo = (plan: ClientPlan, videoId: string): ClientPlan => ({
  ...plan,
  workouts: plan.workouts.map((w) => ({
    ...w,
    exercises: w.exercises.map((e) => (e.videoId === videoId ? { ...e, videoId: undefined } : e)),
  })),
});

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      login: (role) => set({ role }),
      logout: () => set({ role: null, rest: null }),
      saveSet: (key, index, value) =>
        set((s) => {
          const list: SetList = [...(s.logs[key] ?? [])];
          for (let i = 0; i < index; i++) list[i] ??= null;
          list[index] = value;
          return { logs: { ...s.logs, [key]: list } };
        }),

      setPlan: (clientId, plan) => set((s) => ({ plans: { ...s.plans, [clientId]: plan } })),
      saveTemplate: (template) =>
        set((s) => ({
          templates: s.templates.some((t) => t.id === template.id)
            ? s.templates.map((t) => (t.id === template.id ? template : t))
            : [...s.templates, template],
        })),
      removeTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      assignTemplate: (templateId, clientId) =>
        set((s) => {
          const t = s.templates.find((x) => x.id === templateId);
          if (!t || !clients.some((c) => c.id === clientId)) return {};
          const assigned = { ...s.assigned, [clientId]: { ...s.assigned[clientId], [t.kind]: t.name } };
          if (t.kind === "Comidas") return { assigned, targetsBy: { ...s.targetsBy, [clientId]: { ...t.targets } } };
          // Copia: cambiar luego la rutina de la clienta no toca la plantilla
          const today = dayKey();
          const plan = clonePlan(t.plan);
          for (const w of plan.workouts) for (const e of w.exercises) e.setOn = today;
          return { assigned, plans: { ...s.plans, [clientId]: plan }, routine: clientId === DEMO_CLIENT ? null : s.routine };
        }),

      book: (data) => {
        const s = get();
        const taken = s.appointments.some((a) => a.status === "booked" && a.start === data.start);
        if (taken) return false;
        if (data.by === "client" && bonus(data.clientId, s.appointments, s.packs).free <= 0) return false;
        const appointment: Appointment = { ...data, id: newId("cita"), status: "booked", unseen: data.by === "coach" };
        set({ appointments: [...s.appointments, appointment] });
        return true;
      },
      cancelAppointment: (id, who) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            // Fuera de plazo, la clienta no puede cancelar
            a.id === id && (who === "coach" || canCancel(a)) ? { ...a, status: "cancelled" as const, unseen: false } : a,
          ),
        })),
      returnSession: (id, returned) =>
        set((s) => ({ appointments: s.appointments.map((a) => (a.id === id ? { ...a, returned } : a)) })),
      markSeen: (clientId) =>
        set((s) => ({ appointments: s.appointments.map((a) => (a.clientId === clientId && a.unseen ? { ...a, unseen: false } : a)) })),
      addPack: (clientId, sessions) =>
        set((s) => ({ packs: [...s.packs, { id: newId("bono"), clientId, sessions, date: dayKey() }] })),
      removePack: (id) => set((s) => ({ packs: s.packs.filter((p) => p.id !== id) })),
      toggleSlot: (weekday, time) =>
        set((s) => {
          const day = s.availability[weekday] ?? [];
          const next = day.includes(time) ? day.filter((t) => t !== time) : [...day, time].sort();
          return { availability: { ...s.availability, [weekday]: next } };
        }),

      addVideo: (video) => set((s) => ({ videos: [video, ...s.videos] })),
      updateVideo: (id, patch) => set((s) => ({ videos: s.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVideo: (id) =>
        set((s) => ({
          videos: s.videos.filter((v) => v.id !== id),
          plans: Object.fromEntries(Object.entries(s.plans).map(([k, p]) => [k, withoutVideo(p, id)])),
          templates: s.templates.map((t) => (t.kind === "Rutina" ? { ...t, plan: withoutVideo(t.plan, id) } : t)),
        })),

      setRoutine: (id) => set({ routine: id ? { date: dayKey(), id } : null }),
      startRest: (name, seconds) => set({ rest: { name, total: seconds, endsAt: Date.now() + seconds * 1000 } }),
      stopRest: () => set({ rest: null }),
      setBought: (keys, value) =>
        set((s) => ({ bought: { ...s.bought, ...Object.fromEntries(keys.map((k) => [k, value])) } })),
      toggleEaten: (key) => set((s) => ({ eaten: { ...s.eaten, [key]: !s.eaten[key] } })),
      addFood: (date, food) =>
        set((s) => ({ extra: { ...s.extra, [date]: [...(s.extra[date] ?? []), { ...food, id: newId("x") }] } })),
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
    { name: "elenitafit-demo-v3", storage: createJSONStorage(() => localStorage) },
  ),
);

/** Rutina de una clienta (la base si Elena no le ha puesto otra). */
export const usePlan = (clientId: string = DEMO_CLIENT) => useApp((s) => s.plans[clientId]) ?? defaultPlan;
