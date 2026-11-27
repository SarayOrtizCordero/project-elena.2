// Reglas de la agenda presencial y de los bonos. Funciones puras: sin pantalla ni almacenamiento.

export type AppointmentKind = "entreno" | "valoracion" | "nutricion" | "otro";

export const kinds: Record<AppointmentKind, string> = {
  entreno: "Entrenamiento presencial",
  valoracion: "Valoración y medidas",
  nutricion: "Consulta de nutrición",
  otro: "Otra consulta",
};

export type Appointment = {
  id: string;
  clientId: string;
  /** Hora local: "2026-11-28T10:00" */
  start: string;
  kind: AppointmentKind;
  status: "booked" | "cancelled";
  by: "client" | "coach";
  /** Elena ha devuelto la sesión al bono (por ejemplo, si no se pudo dar) */
  returned?: boolean;
  /** La clienta aún no ha visto una cita puesta por Elena */
  unseen?: boolean;
};

export type Pack = { id: string; clientId: string; sessions: number; date: string };

/** Lunes (0) → domingo (6): horas en las que Elena atiende. */
export type Availability = Record<number, string[]>;

/** Dónde y cuándo se dan las sesiones presenciales. */
export const GYM = {
  name: "ACTIVA-T",
  address: "Calle Blas Infante, 5",
  schedule: "L-V 8:00 a 22:00 · S 10:00 a 13:00",
};

/**
 * Horas en las que se puede empezar una sesión (de una hora) según el horario del gimnasio.
 * Lunes (0) → domingo (6): L-V 8:00-22:00, sábado 10:00-13:00, domingo cerrado.
 */
export function gymHours(weekday: number): string[] {
  const [from, to] = weekday <= 4 ? [8, 22] : weekday === 5 ? [10, 13] : [0, 0];
  return Array.from({ length: to - from }, (_, i) => `${pad(from + i)}:00`);
}

/** Antelación mínima para que la clienta pueda cancelar. */
export const CANCEL_HOURS = 24;

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const weekdayOf = (d: Date) => (d.getDay() + 6) % 7;

export const startOf = (a: Appointment) => new Date(a.start);
export const isPast = (a: Appointment, now: Date = new Date()) => startOf(a) <= now;

export const canCancel = (a: Appointment, now: Date = new Date()) =>
  a.status === "booked" && startOf(a).getTime() - now.getTime() >= CANCEL_HOURS * 3_600_000;

/**
 * Estado del bono. Una sesión se descuenta sola cuando llega la hora de la cita,
 * salvo que se cancelara a tiempo o Elena la devuelva.
 * `left` = quedan en el bono · `free` = quedan sin reservar.
 */
export function bonus(clientId: string, appointments: Appointment[], packs: Pack[], now: Date = new Date()) {
  const bought = packs.filter((p) => p.clientId === clientId).reduce((sum, p) => sum + p.sessions, 0);
  const counting = appointments.filter((a) => a.clientId === clientId && a.status === "booked" && !a.returned);
  const used = counting.filter((a) => isPast(a, now)).length;
  const pending = counting.length - used;
  return { bought, used, pending, left: bought - used, free: bought - used - pending };
}

/** Horas libres de un día: dentro del horario, futuras y sin otra cita. */
export function freeSlots(date: string, availability: Availability, appointments: Appointment[], now: Date = new Date()) {
  const [y, m, d] = date.split("-").map(Number);
  const taken = new Set(appointments.filter((a) => a.status === "booked").map((a) => a.start));
  const weekday = weekdayOf(new Date(y, m - 1, d));
  const open = gymHours(weekday);
  return [...(availability[weekday] ?? [])]
    .filter((time) => open.includes(time))
    .sort()
    .filter((time) => !taken.has(`${date}T${time}`) && new Date(`${date}T${time}`) > now);
}

/** Cita en formato .ics, para guardarla en el calendario del móvil con aviso el día antes. */
export function calendarFile(a: Appointment, title: string) {
  const stamp = (d: Date) => `${keyOf(d).replaceAll("-", "")}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const start = startOf(a);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ElenitaFit//Agenda//ES",
    "BEGIN:VEVENT",
    `UID:${a.id}@elenitafit`,
    `DTSTAMP:${stamp(start)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(new Date(start.getTime() + 3_600_000))}`,
    `SUMMARY:${title} con Elena`,
    `DESCRIPTION:Puedes cancelar hasta ${CANCEL_HOURS} h antes. Después la sesión cuenta como realizada.`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Cita con Elena",
    `TRIGGER:-PT${CANCEL_HOURS}H`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export type DayStatus = "done" | "missed" | "today" | "todo" | "rest";

/** Estado de cada día de la semana en curso, según lo que se ha registrado de verdad. */
export function weekStatus(plan: (string | null)[], active: Set<string>, now: Date = new Date()): DayStatus[] {
  const today = weekdayOf(now);
  return plan.map((workout, i) => {
    const date = keyOf(new Date(now.getFullYear(), now.getMonth(), now.getDate() - today + i));
    if (active.has(date)) return "done";
    if (!workout) return "rest";
    if (i < today) return "missed";
    return i === today ? "today" : "todo";
  });
}
