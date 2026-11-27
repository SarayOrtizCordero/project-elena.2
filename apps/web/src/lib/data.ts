// Contenido PROVISIONAL para la demo. Sustituir por el real de Elena.

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "production" ? "https://project-elena-2-app.vercel.app" : "http://localhost:3001");
export const INSTAGRAM_URL = "https://www.instagram.com/eleniitaafit";
/** Número de Elena: +34 644 47 19 96 (prefijo de país, sin + ni espacios). */
export const WHATSAPP_NUMBER = "34644471996";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Elena, quiero info")}`;

export const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#app", label: "App" },
  { href: "#planes", label: "Planes" },
  { href: "#galeria", label: "Galería" },
  { href: "#faq", label: "Dudas" },
];

export const marquee = ["Entreno personal", "Online", "Nutrición", "Combo", "Constancia", "Resultados", "Sin excusas"];

export const stats = [
  { value: 320, suffix: "+", label: "Clientes entrenando" },
  { value: 8, suffix: " años", label: "De experiencia" },
  { value: 94, suffix: "%", label: "Siguen tras 3 meses" },
];

export const services = [
  {
    id: "presencial",
    title: "Entreno personal",
    tag: "En el gym",
    photo: "/photos/trainer.jpg",
    alt: "Entrenador guiando a una mujer en una máquina de remo",
    blurb: "Sesiones en sala con corrección técnica en directo y alguien que marca el ritmo a tu lado.",
    points: ["Sesiones 1:1 o en grupo reducido", "Técnica corregida al momento", "Valoración física inicial", "Rutina a tu medida"],
  },
  {
    id: "online",
    title: "Entreno online",
    tag: "Desde donde estés",
    photo: "/photos/online.jpg",
    alt: "Mujer consultando su móvil en un gimnasio",
    blurb: "Tu rutina y tu progreso en una app. Ajusto tu plan cada semana según tus datos.",
    points: ["Rutina guiada paso a paso", "Vídeos de cada ejercicio", "Seguimiento semanal personalizado", "Contacto directo con Elena"],
  },
  {
    id: "nutricion",
    title: "Nutrición",
    tag: "Tu alimentación",
    photo: null,
    alt: "",
    blurb: "Un plan de comidas realista, con calorías y macros, que puedas cumplir sin pasar hambre ni contar cada gramo.",
    points: ["Plan de comidas a tu medida", "Calorías y macros calculados", "Lista de la compra semanal", "Ajustes según tu progreso"],
  },
  {
    id: "combo",
    title: "Combo completo",
    tag: "Lo más completo",
    photo: "/photos/mirror.jpg",
    alt: "Dos mujeres levantando mancuernas frente al espejo",
    blurb: "Entrenamiento y nutrición en un solo plan, coordinados entre sí y con un único seguimiento.",
    points: ["Entreno + nutrición coordinados", "Un solo plan y un solo seguimiento", "Presencial u online", "Todo en tu app"],
  },
];

export const steps = [
  { n: "01", title: "Cuéntame tu objetivo", text: "Un cuestionario rápido: meta, horarios, lesiones y lo que te gusta comer." },
  { n: "02", title: "Recibe tu plan", text: "Rutina y alimentación diseñadas para ti, listas en tu app en 24-48 h." },
  { n: "03", title: "Entrena y registra", text: "Marca series, anota comidas y sube tu peso. Todo en un par de toques." },
  { n: "04", title: "Ajustamos juntas", text: "Reviso tus datos y adapto el plan para que no te estanques nunca." },
];

/** Duración de cada tarifa, en meses. */
export const periods = [
  { months: 1, label: "Mes", unit: "/mes" },
  { months: 3, label: "Trimestre", unit: "/trimestre" },
  { months: 6, label: "Semestre", unit: "/semestre" },
  { months: 12, label: "Año", unit: "/año" },
] as const;

export type Option = {
  id: "nutricion" | "entreno" | "lanzamiento" | "pack";
  tab: string;
  title: string;
  badge?: string;
  lead: string;
  features: string[];
  /** Precio por duración (meses → euros). Falta la clave si esa duración no existe. */
  prices: Partial<Record<1 | 3 | 6 | 12, number>>;
};

const packFeatures = [
  "Rutina y plan de comidas coordinados",
  "Un solo seguimiento en tu app",
  "Registro de series, pesos y comidas",
  "Lista de la compra semanal",
];

export const options: Option[] = [
  {
    id: "lanzamiento",
    tab: "Pack lanzamiento",
    title: "Pack completo",
    badge: "Lanzamiento · 20 plazas",
    lead: "Entreno y nutrición en un solo plan. Precio especial para las primeras 20 plazas.",
    features: packFeatures,
    prices: { 1: 69, 3: 175, 6: 345, 12: 620 },
  },
  {
    id: "pack",
    tab: "Pack completo",
    title: "Pack completo",
    lead: "Entreno y nutrición en un solo plan, con un único seguimiento.",
    features: packFeatures,
    prices: { 1: 79, 3: 199, 6: 389, 12: 699 },
  },
  {
    id: "entreno",
    tab: "Solo entreno",
    title: "Solo entreno",
    lead: "Tu rutina en la app, con ajustes según tu progreso.",
    features: ["Rutina personalizada", "Registro de series y pesos", "Vídeos de los ejercicios", "Ajustes según tu progreso"],
    prices: { 1: 59, 3: 150, 6: 299 },
  },
  {
    id: "nutricion",
    tab: "Solo nutrición",
    title: "Solo nutrición",
    lead: "Plan de comidas a tu medida, con calorías y macros.",
    features: ["Plan de comidas personalizado", "Calorías y macros", "Lista de la compra", "Seguimiento en la app"],
    prices: { 1: 45, 3: 125, 6: 239 },
  },
];

export type Bono = { name: string; sessions: number; price: number; badge?: string; featured?: boolean };

/** Bonos de entreno personal presencial: pago único por bono. */
export const bonos: Bono[] = [
  { name: "Bono 8", sessions: 8, price: 120 },
  { name: "Bono 10", sessions: 10, price: 140, badge: "Más elegido", featured: true },
  { name: "Bono 12", sessions: 12, price: 160 },
];

export const transformations = [
  { name: "Lucía, 29", result: "-9 kg", time: "4 meses", mode: "Online" },
  { name: "Marta, 34", result: "+3 kg de músculo", time: "6 meses", mode: "Presencial" },
  { name: "Carla, 41", result: "-12 cm de cintura", time: "5 meses", mode: "Híbrido" },
];

export const testimonials = [
  { name: "Lucía M.", text: "Por fin un plan que encaja con mi vida. La app me lo pone fácil y Elena siempre responde.", mode: "Online", stars: 5 },
  { name: "Javier P.", text: "Muy buen trato y rutinas bien explicadas. Elena ajusta todo a lo que necesito en cada momento.", mode: "Presencial", stars: 4 },
  { name: "Marta G.", text: "Vine sin saber ni coger una barra. Ahora entreno con confianza y se nota en todo.", mode: "Presencial", stars: 5 },
  { name: "Daniel R.", text: "El seguimiento semanal marca la diferencia. Nunca me he sentido solo en el proceso.", mode: "Híbrido", stars: 4 },
  { name: "Carla S.", text: "Me ha ayudado a coger el hábito de entrenar tres días por semana. La app es sencilla y los vídeos ayudan mucho.", mode: "Online", stars: 5 },
  { name: "Álvaro T.", text: "Resultados reales en pocos meses. Elena es muy cercana y la app lo pone fácil.", mode: "Híbrido", stars: 4 },
];

export const faqs = [
  { q: "¿Necesito experiencia previa?", a: "No. Adapto todo a tu nivel, desde cero hasta avanzado, con vídeos y explicaciones de cada ejercicio." },
  { q: "¿Puedo entrenar en casa?", a: "Sí. Si eliges online, tu rutina se diseña con el material que tengas: gym, casa o mancuernas." },
  { q: "¿Cómo recibo mi plan?", a: "Rellenas el cuestionario y en 24-48 h lo tienes en tu app, con rutina, comidas y lista de la compra." },
  { q: "¿Puedo contratar solo nutrición?", a: "Sí. La nutrición se puede contratar sola o combinada con el entrenamiento en el combo completo." },
  { q: "¿Se puede cancelar?", a: "Sí, sin permanencia. Avisas con unos días de antelación y no se renueva." },
  { q: "¿Qué pasa si tengo una lesión?", a: "Me lo cuentas en el cuestionario y adapto los ejercicios. Si hace falta, te recomiendo consultar antes con tu médico." },
];

export const gallery = [
  { src: "/photos/group.jpg", alt: "Grupo de mujeres haciendo sentadillas en un estudio con ventanales", label: "Clases en grupo", cls: "col-span-2 row-span-2" },
  { src: "/photos/legs.jpg", alt: "Piernas de una mujer subiendo en una máquina de cardio", label: "Cardio", cls: "row-span-2" },
  { src: "/photos/mirror.jpg", alt: "Dos mujeres levantando mancuernas frente al espejo", label: "Fuerza", cls: "row-span-2" },
  { src: "/photos/class.jpg", alt: "Mujer sonriendo con una mancuerna en alto durante una clase", label: "Energía", cls: "col-span-2" },
  { src: "/photos/strong.jpg", alt: "Mujer estirando los brazos en un estudio de entrenamiento", label: "Movilidad", cls: "" },
  { src: "/photos/coach.jpg", alt: "Entrenador corrigiendo la postura de una mujer sentada", label: "Técnica", cls: "" },
];

export const appPoints = [
  { title: "Tu entreno del día", text: "Marca cada serie y usa el temporizador de descanso entre ejercicios." },
  { title: "Comidas y calorías", text: "Tu plan de comidas con calorías y macros. Añade lo que comas fuera de plan." },
  { title: "Progreso a la vista", text: "Registra tu peso y mira tu evolución en una gráfica clara." },
  { title: "Elena te acompaña", text: "Ella ve tu progreso y ajusta tu plan cuando lo necesitas." },
];

/** Instalar la app = añadirla a la pantalla de inicio desde el navegador (PWA), sin tiendas. */
export const installSteps = [
  { os: "Android", how: "En Chrome: menú ⋮ → «Instalar app»." },
  { os: "iPhone", how: "En Safari: botón Compartir → «Añadir a pantalla de inicio»." },
  { os: "Ordenador", how: "En Chrome o Edge: icono de instalar en la barra de direcciones." },
];
