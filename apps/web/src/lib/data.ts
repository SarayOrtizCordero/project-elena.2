// Contenido PROVISIONAL para la demo. Sustituir por el real de Elena.

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
export const INSTAGRAM_URL = "https://www.instagram.com/eleniitaafit";
export const WHATSAPP_URL = "https://wa.me/34600000000?text=Hola%20Elena%2C%20quiero%20info";

export const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#planes", label: "Planes" },
  { href: "#resultados", label: "Resultados" },
  { href: "#faq", label: "Dudas" },
];

export const marquee = ["Fuerza", "Nutrición", "Online", "Presencial", "Constancia", "Resultados", "Sin excusas"];

export const stats = [
  { value: 320, suffix: "+", label: "Clientes entrenando" },
  { value: 8, suffix: " años", label: "De experiencia" },
  { value: 94, suffix: "%", label: "Siguen tras 3 meses" },
];

export const services = [
  {
    id: "presencial",
    title: "Presencial",
    tag: "En el gym",
    blurb: "Sesiones en sala con corrección técnica en directo, ritmo marcado y motivación real a tu lado.",
    points: ["Sesiones 1:1 o en grupo reducido", "Técnica corregida al momento", "Valoración física inicial", "Plan de nutrición incluido"],
  },
  {
    id: "online",
    title: "Online",
    tag: "Desde donde estés",
    blurb: "Tu rutina, tus comidas y tu progreso en una app. Elena ajusta tu plan cada semana según tus datos.",
    points: ["Rutina con vídeos de cada ejercicio", "Plan de comidas y calorías", "Seguimiento semanal personalizado", "Chat directo con Elena"],
  },
];

export const steps = [
  { n: "01", title: "Cuéntame tu objetivo", text: "Un cuestionario rápido: meta, horarios, lesiones y lo que te gusta comer." },
  { n: "02", title: "Recibe tu plan", text: "Rutina y alimentación diseñadas para ti, listas en tu app en 24-48 h." },
  { n: "03", title: "Entrena y registra", text: "Marca series, anota comidas y sube tu peso. Todo en un par de toques." },
  { n: "04", title: "Ajustamos juntas", text: "Reviso tus datos y adapto el plan para que no te estanques nunca." },
];

export type Plan = {
  name: string;
  price: number;
  unit: string;
  badge?: string;
  features: string[];
  featured?: boolean;
};

export const plans: Record<"online" | "presencial", Plan[]> = {
  online: [
    { name: "Esencial", price: 29, unit: "/mes", features: ["Rutina personalizada", "Plan de comidas", "App de seguimiento", "Soporte por email"] },
    {
      name: "Pro",
      price: 59,
      unit: "/mes",
      badge: "Más elegido",
      featured: true,
      features: ["Todo lo de Esencial", "Ajustes semanales", "Chat directo con Elena", "Revisión de técnica por vídeo", "Lista de la compra"],
    },
    { name: "Trimestral", price: 149, unit: "/3 meses", features: ["Todo lo de Pro", "Ahorra 28 €", "Sesión de videollamada", "Prioridad en respuestas"] },
  ],
  presencial: [
    { name: "Bono 4", price: 70, unit: "/mes", features: ["4 sesiones al mes", "Valoración inicial", "Plan de nutrición base"] },
    {
      name: "Bono 8",
      price: 120,
      unit: "/mes",
      badge: "Más elegido",
      featured: true,
      features: ["8 sesiones al mes", "Valoración y medidas", "Plan de nutrición completo", "Acceso a la app", "Chat directo con Elena"],
    },
    { name: "Híbrido", price: 160, unit: "/mes", features: ["8 sesiones + online", "Ajustes semanales", "App y chat sin límites", "Prioridad de agenda"] },
  ],
};

export const transformations = [
  { name: "Lucía, 29", result: "-9 kg", time: "4 meses", mode: "Online" },
  { name: "Marta, 34", result: "+3 kg de músculo", time: "6 meses", mode: "Presencial" },
  { name: "Carla, 41", result: "-12 cm de cintura", time: "5 meses", mode: "Híbrido" },
];

export const testimonials = [
  { name: "Lucía M.", text: "Por fin un plan que encaja con mi vida. La app me lo pone fácil y Elena siempre responde.", mode: "Online" },
  { name: "Marta G.", text: "Vine sin saber ni coger una barra. Ahora entreno con confianza y se nota en todo.", mode: "Presencial" },
  { name: "Carla R.", text: "El seguimiento semanal marca la diferencia. Nunca me he sentido sola en el proceso.", mode: "Híbrido" },
];

export const faqs = [
  { q: "¿Necesito experiencia previa?", a: "No. Adapto todo a tu nivel, desde cero hasta avanzado, con vídeos y explicaciones de cada ejercicio." },
  { q: "¿Puedo entrenar en casa?", a: "Sí. Si eliges online, tu rutina se diseña con el material que tengas: gym, casa o mancuernas." },
  { q: "¿Cómo recibo mi plan?", a: "Rellenas el cuestionario y en 24-48 h lo tienes en tu app, con rutina, comidas y lista de la compra." },
  { q: "¿Se puede cancelar?", a: "Sí, sin permanencia. Avisas con unos días de antelación y no se renueva." },
  { q: "¿Qué pasa si tengo una lesión?", a: "Me lo cuentas en el cuestionario y adapto los ejercicios. Si hace falta, te recomiendo consultar antes con tu médico." },
];
