// Datos de ejemplo de la demo, siempre relativos a la fecha de hoy.
import type { Appointment, Availability, Pack } from "./agenda";
import { weekPlan, workouts } from "./data";
import type { SetList, WeightEntry } from "./store";

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return keyOf(d);
};

export function seedWeights(): WeightEntry[] {
  const kgs = [68.6, 68.1, 67.9, 67.2, 66.8, 66.5, 66.1, 65.6, 65.3];
  return kgs.map((kg, i) => ({ date: daysFromNow(-3 - 7 * (kgs.length - 1 - i)), kg }));
}

/** Historial: los dos primeros ejercicios de cada rutina, y los días ya entrenados de esta semana. */
export function seedLogs(): Record<string, SetList> {
  const out: Record<string, SetList> = {};
  const add = (date: string, ex: (typeof workouts)[number]["exercises"][number], lighter = 0) => {
    const kg = Math.max(0, ex.kg - lighter);
    const reps = parseInt(ex.reps, 10);
    out[`${date}:${ex.id}`] = Array.from({ length: ex.sets }, (_, i) => ({ kg, reps: i === ex.sets - 1 ? reps - 1 : reps }));
  };
  for (const ago of [14, 7]) for (const w of workouts) for (const ex of w.exercises.slice(0, 2)) add(daysFromNow(-ago), ex, ago === 14 ? 2 : 0);
  const today = (new Date().getDay() + 6) % 7;
  for (let i = 0; i < today; i++) {
    const w = workouts.find((x) => x.id === weekPlan[i]);
    if (w) add(daysFromNow(i - today), w.exercises[w.exercises.length - 1]);
  }
  return out;
}

export function seedAppointments(): Appointment[] {
  const make = (id: string, clientId: string, days: number, time: string, extra: Partial<Appointment> = {}): Appointment => ({
    id,
    clientId,
    start: `${daysFromNow(days)}T${time}`,
    kind: "entreno",
    status: "booked",
    by: "coach",
    ...extra,
  });
  return [
    make("c1", "lucia", -16, "10:00"),
    make("c2", "lucia", -9, "10:00"),
    make("c3", "lucia", -2, "18:00"),
    make("c4", "lucia", 3, "10:00", { unseen: true }),
    make("c5", "marta", 1, "09:00"),
    make("c6", "paula", 1, "17:00"),
    make("c7", "carla", 2, "18:00", { kind: "valoracion" }),
    make("c8", "marta", -5, "09:00"),
  ];
}

export function seedPacks(): Pack[] {
  const pack = (clientId: string, sessions: number, ago: number): Pack => ({ id: `b-${clientId}`, clientId, sessions, date: daysFromNow(-ago) });
  return [pack("lucia", 8, 20), pack("marta", 8, 25), pack("paula", 4, 12), pack("carla", 4, 15)];
}

export function seedAvailability(): Availability {
  const weekday = ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"];
  return { 0: weekday, 1: weekday, 2: weekday, 3: weekday, 4: weekday, 5: ["10:00", "11:00", "12:00"], 6: [] };
}
