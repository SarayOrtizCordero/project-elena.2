// Datos PROVISIONALES para la demo. En producción vendrán de Supabase.

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  kg: number; // peso inicial propuesto (Elena puede cambiarlo por clienta)
  rest: number; // segundos
};

export type Workout = {
  id: string;
  title: string;
  focus: string;
  minutes: number;
  exercises: Exercise[];
};

export const workouts: Workout[] = [
  {
    id: "push",
    title: "Empuje",
    focus: "Pecho · Hombro · Tríceps",
    minutes: 55,
    exercises: [
      { id: "push-1", name: "Press banca con mancuernas", muscle: "Pecho", sets: 4, reps: "8-10", kg: 18, rest: 90 },
      { id: "push-2", name: "Press militar sentada", muscle: "Hombro", sets: 3, reps: "10", kg: 12, rest: 75 },
      { id: "push-3", name: "Aperturas en polea", muscle: "Pecho", sets: 3, reps: "12-15", kg: 8, rest: 60 },
      { id: "push-4", name: "Elevaciones laterales", muscle: "Hombro", sets: 3, reps: "15", kg: 5, rest: 45 },
      { id: "push-5", name: "Extensión de tríceps en polea", muscle: "Tríceps", sets: 3, reps: "12", kg: 15, rest: 45 },
    ],
  },
  {
    id: "lower",
    title: "Pierna",
    focus: "Cuádriceps · Femoral · Core",
    minutes: 60,
    exercises: [
      { id: "lower-1", name: "Sentadilla trasera", muscle: "Cuádriceps", sets: 4, reps: "8", kg: 45, rest: 120 },
      { id: "lower-2", name: "Peso muerto rumano", muscle: "Femoral", sets: 3, reps: "10", kg: 35, rest: 90 },
      { id: "lower-3", name: "Prensa de piernas", muscle: "Cuádriceps", sets: 3, reps: "12", kg: 90, rest: 75 },
      { id: "lower-4", name: "Curl femoral tumbada", muscle: "Femoral", sets: 3, reps: "12", kg: 25, rest: 60 },
      { id: "lower-5", name: "Plancha", muscle: "Core", sets: 3, reps: "45 s", kg: 0, rest: 45 },
    ],
  },
  {
    id: "pull",
    title: "Tirón",
    focus: "Espalda · Bíceps",
    minutes: 50,
    exercises: [
      { id: "pull-1", name: "Jalón al pecho", muscle: "Espalda", sets: 4, reps: "10", kg: 40, rest: 75 },
      { id: "pull-2", name: "Remo con mancuerna", muscle: "Espalda", sets: 3, reps: "10", kg: 16, rest: 75 },
      { id: "pull-3", name: "Face pull", muscle: "Hombro post.", sets: 3, reps: "15", kg: 15, rest: 45 },
      { id: "pull-4", name: "Curl de bíceps", muscle: "Bíceps", sets: 3, reps: "12", kg: 8, rest: 45 },
    ],
  },
  {
    id: "glute",
    title: "Glúteo",
    focus: "Glúteo · Isquios",
    minutes: 55,
    exercises: [
      { id: "glute-1", name: "Hip thrust con barra", muscle: "Glúteo", sets: 4, reps: "10", kg: 50, rest: 90 },
      { id: "glute-2", name: "Zancada búlgara", muscle: "Glúteo", sets: 3, reps: "10", kg: 10, rest: 75 },
      { id: "glute-3", name: "Abducción en máquina", muscle: "Glúteo", sets: 3, reps: "15", kg: 35, rest: 45 },
      { id: "glute-4", name: "Puente de glúteo a una pierna", muscle: "Glúteo", sets: 3, reps: "12", kg: 0, rest: 45 },
    ],
  },
];

/** Lunes→Domingo: id de rutina o null (descanso). */
export const weekPlan: (string | null)[] = ["push", "lower", null, "pull", "glute", null, null];
export const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

export type MealItem = {
  id: string;
  name: string;
  qty: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
};

export const targets = { kcal: 2000, p: 135, c: 210, f: 70 };

export const foodDb: Omit<MealItem, "id">[] = [
  { name: "Plátano", qty: "1 ud", kcal: 105, p: 1, c: 27, f: 0 },
  { name: "Huevo cocido", qty: "1 ud", kcal: 78, p: 6, c: 1, f: 5 },
  { name: "Pan integral", qty: "1 rebanada", kcal: 80, p: 4, c: 14, f: 1 },
  { name: "Atún al natural", qty: "1 lata", kcal: 110, p: 25, c: 0, f: 1 },
  { name: "Avena", qty: "40 g", kcal: 150, p: 5, c: 27, f: 3 },
  { name: "Queso fresco batido", qty: "125 g", kcal: 60, p: 10, c: 4, f: 0 },
  { name: "Aguacate", qty: "½ ud", kcal: 160, p: 2, c: 9, f: 15 },
  { name: "Pasta integral", qty: "80 g (crudo)", kcal: 280, p: 11, c: 54, f: 2 },
  { name: "Ternera magra", qty: "150 g", kcal: 250, p: 38, c: 0, f: 10 },
  { name: "Barrita de proteína", qty: "1 ud", kcal: 200, p: 20, c: 18, f: 7 },
  { name: "Café con leche", qty: "1 taza", kcal: 60, p: 4, c: 6, f: 2 },
  { name: "Hummus", qty: "50 g", kcal: 120, p: 4, c: 8, f: 8 },
];

export type Client = {
  id: string;
  name: string;
  mode: "Online" | "Presencial" | "Híbrido";
  goal: string;
  adherence: number; // 0-100
  lastDays: number; // días desde la última actividad
  trend: number[]; // peso semanal
  note: string;
};

export const clients: Client[] = [
  { id: "lucia", name: "Lucía Martín", mode: "Online", goal: "Perder grasa", adherence: 92, lastDays: 0, trend: [71.2, 70.6, 70.1, 69.4, 68.9, 68.2, 67.8, 67.1], note: "Muy constante. Subir cargas en pierna." },
  { id: "marta", name: "Marta García", mode: "Presencial", goal: "Ganar músculo", adherence: 85, lastDays: 1, trend: [58.0, 58.3, 58.5, 58.9, 59.2, 59.4, 59.9, 60.3], note: "Buena progresión. Revisar proteína." },
  { id: "carla", name: "Carla Ruiz", mode: "Híbrido", goal: "Recomposición", adherence: 74, lastDays: 2, trend: [66.0, 65.8, 65.9, 65.4, 65.3, 65.0, 65.1, 64.7], note: "Baja en fines de semana." },
  { id: "sofia", name: "Sofía Navarro", mode: "Online", goal: "Perder grasa", adherence: 48, lastDays: 6, trend: [79.0, 78.9, 78.8, 78.9, 78.7, 78.8, 78.8, 78.7], note: "Sin registros esta semana. Escribirle." },
  { id: "paula", name: "Paula Ortega", mode: "Presencial", goal: "Salud y fuerza", adherence: 88, lastDays: 0, trend: [62.0, 62.1, 61.9, 61.8, 61.9, 61.7, 61.6, 61.6], note: "Ritmo excelente." },
  { id: "irene", name: "Irene Soto", mode: "Online", goal: "Ganar músculo", adherence: 61, lastDays: 4, trend: [54.0, 54.1, 54.2, 54.2, 54.4, 54.4, 54.5, 54.6], note: "Ajustar calorías al alza." },
];

export const templates = [
  { id: "t1", kind: "Rutina", name: "Empuje / Tirón / Pierna · 4 días", uses: 14 },
  { id: "t2", kind: "Rutina", name: "Full body para principiantes · 3 días", uses: 22 },
  { id: "t3", kind: "Rutina", name: "Glúteo y pierna · 4 días", uses: 17 },
  { id: "t4", kind: "Comidas", name: "Definición · 1.800 kcal", uses: 19 },
  { id: "t5", kind: "Comidas", name: "Mantenimiento · 2.100 kcal", uses: 11 },
  { id: "t6", kind: "Comidas", name: "Volumen limpio · 2.600 kcal", uses: 8 },
];
