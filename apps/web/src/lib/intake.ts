// Cuestionario de alta: opciones, qué bloques se ven según el servicio y mensaje de WhatsApp.

export const services = [
  { id: "online", label: "Solo entrenamiento online", training: true, nutrition: false },
  { id: "nutricion", label: "Solo nutrición", training: false, nutrition: true },
  { id: "pack", label: "Pack completo (entrenamiento + nutrición)", training: true, nutrition: true },
  { id: "presencial", label: "Entreno personal presencial", training: true, nutrition: false },
] as const;
export type ServiceId = (typeof services)[number]["id"];

export const trainingGoals = ["Pérdida de grasa", "Ganancia muscular / tonificación", "Rendimiento deportivo", "Readaptación / movilidad", "Mejora general"];
export const levels = ["Principiante", "Intermedio", "Avanzado"];
export const places = ["Gimnasio completo", "Gimnasio de casa / material básico", "Solo peso corporal"];
export const nutritionGoals = ["Pérdida de grasa", "Recomposición / ganancia de masa", "Rendimiento deportivo", "Mejorar hábitos y digestión"];

/** Texto limpio y acotado: el enlace de WhatsApp tiene un límite de longitud. */
function clean(v: FormDataEntryValue | null, max = 400) {
  const t = String(v ?? "").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

/** Convierte las respuestas en un mensaje ordenado para WhatsApp. */
export function buildMessage(data: FormData, service: ServiceId) {
  const svc = services.find((s) => s.id === service)!;
  const g = (k: string, max?: number) => clean(data.get(k), max) || "—";
  const lines: string[] = [
    "*Nueva solicitud · ElenitaFit*",
    "",
    "*DATOS*",
    `Nombre: ${g("name", 80)}`,
    `Email: ${g("email", 80)}`,
    `Teléfono: ${g("phone", 30)}`,
    `Edad: ${g("age", 3)} años · Altura: ${g("height", 3)} cm · Peso: ${g("weight", 5)} kg`,
    `Servicio: ${svc.label}`,
  ];
  if (svc.training) {
    lines.push(
      "",
      "*ENTRENAMIENTO*",
      `Objetivo: ${g("t_goal")}`,
      `Nivel: ${g("t_level")}${clean(data.get("t_exp")) ? ` (${clean(data.get("t_exp"), 200)})` : ""}`,
      `Lugar y material: ${g("t_place")}`,
      `Disponibilidad: ${g("t_days")} días/semana · ${g("t_minutes")} min/sesión`,
      `Lesiones o limitaciones: ${g("t_injuries")}`,
      `Otro deporte: ${g("t_sport")}`,
    );
  }
  if (svc.nutrition) {
    lines.push(
      "",
      "*NUTRICIÓN*",
      `Objetivo: ${g("n_goal")}`,
      `Rutina diaria: ${g("n_routine")}`,
      `Comidas al día: ${g("n_meals")} · Hambre: ${g("n_hunger", 200)}`,
      `Alergias/intolerancias/prohibidos: ${g("n_allergies")}`,
      `Gustos y cocina: ${g("n_tastes")}`,
      `Historial y digestión: ${g("n_history")}`,
    );
  }
  lines.push("", "*EXTRA*", `Algo más: ${g("extra", 500)}`, "", "✔ Ha aceptado la política de privacidad y el tratamiento de sus datos de salud.");
  return lines.join("\n");
}
