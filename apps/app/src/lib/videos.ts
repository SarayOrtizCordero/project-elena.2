// Vídeos SIMULADOS de técnica (demo): no hay archivos de vídeo, solo pasos, tiempos y consejos.

export type VideoInfo = {
  /** Duración mostrada, en segundos. */
  duration: number;
  /** Pasos que se muestran como subtítulos mientras "se reproduce". */
  steps: string[];
  /** Error común. */
  tip: string;
};

/** Para ejercicios que Elena crea y aún no tienen vídeo. */
export const fallbackInfo: VideoInfo = {
  duration: 30,
  steps: ["Colócate con una postura estable.", "Haz el recorrido completo, controlando la bajada.", "Exhala en el esfuerzo y mantén la técnica."],
  tip: "Si pierdes la técnica, baja el peso.",
};

export const videoInfo: Record<string, VideoInfo> = {
  "push-1": {
    duration: 36,
    steps: [
      "Túmbate con los pies firmes y las escápulas juntas.",
      "Baja las mancuernas controlando, hasta unos 90° en los codos.",
      "Empuja hacia arriba sin bloquear los codos y exhala al subir.",
    ],
    tip: "No rebotes las pesas en el pecho: baja en 2 segundos.",
  },
  "push-2": {
    duration: 32,
    steps: [
      "Siéntate con la espalda apoyada y el abdomen firme.",
      "Lleva las mancuernas a la altura de las orejas, muñecas rectas.",
      "Empuja hacia arriba sin arquear la zona lumbar.",
    ],
    tip: "Si arqueas la espalda, baja el peso.",
  },
  "push-3": {
    duration: 30,
    steps: [
      "Da un paso al frente con el torso ligeramente inclinado.",
      "Abre los brazos con los codos algo flexionados.",
      "Junta las manos delante del pecho y aprieta al final.",
    ],
    tip: "Piensa en abrazar un árbol, no en empujar.",
  },
  "push-4": {
    duration: 28,
    steps: [
      "Mancuernas a los lados, codos ligeramente flexionados.",
      "Sube hasta la altura de los hombros, liderando con los codos.",
      "Baja despacio sin balancear el cuerpo.",
    ],
    tip: "Usa poco peso: el balanceo le quita trabajo al hombro.",
  },
  "push-5": {
    duration: 28,
    steps: [
      "Codos pegados a las costillas y agarre firme.",
      "Extiende los brazos hacia abajo sin mover los codos.",
      "Vuelve arriba controlando hasta 90° de flexión.",
    ],
    tip: "Los codos no se mueven: si se adelantan, baja la carga.",
  },
  "lower-1": {
    duration: 42,
    steps: [
      "Barra en la espalda alta y pies a la anchura de los hombros.",
      "Baja llevando la cadera atrás y las rodillas hacia fuera.",
      "Sube empujando el suelo con todo el pie y el pecho alto.",
    ],
    tip: "Mantén los talones pegados al suelo en todo momento.",
  },
  "lower-2": {
    duration: 38,
    steps: [
      "Barra pegada a las piernas y rodillas ligeramente flexionadas.",
      "Lleva la cadera atrás deslizando la barra por los muslos.",
      "Sube apretando los glúteos hasta quedar de pie.",
    ],
    tip: "Espalda siempre neutra: baja solo hasta donde no la redondees.",
  },
  "lower-3": {
    duration: 30,
    steps: [
      "Pies a la anchura de los hombros y espalda apoyada.",
      "Baja hasta unos 90° en la rodilla sin despegar la cadera.",
      "Empuja sin bloquear las rodillas al extender.",
    ],
    tip: "No dejes que las rodillas se junten al subir.",
  },
  "lower-4": {
    duration: 28,
    steps: [
      "Túmbate y ajusta el rodillo sobre los talones.",
      "Flexiona llevando los talones hacia los glúteos.",
      "Baja en 3 segundos sin soltar la tensión.",
    ],
    tip: "No levantes la cadera de la máquina.",
  },
  "lower-5": {
    duration: 26,
    steps: [
      "Antebrazos en el suelo y codos bajo los hombros.",
      "Cuerpo en línea recta de la cabeza a los talones.",
      "Aprieta abdomen y glúteos y respira con calma.",
    ],
    tip: "Si la cadera cae o sube, para y descansa.",
  },
  "pull-1": {
    duration: 32,
    steps: [
      "Agarre algo más ancho que los hombros y pecho alto.",
      "Baja la barra hacia la clavícula llevando los codos abajo.",
      "Sube controlando sin encogerte de hombros.",
    ],
    tip: "Tira con los codos, no con las manos.",
  },
  "pull-2": {
    duration: 30,
    steps: [
      "Apoya mano y rodilla en el banco con la espalda plana.",
      "Lleva la mancuerna hacia la cadera, codo cerca del cuerpo.",
      "Baja estirando por completo sin girar el tronco.",
    ],
    tip: "Evita girar el torso para subir más peso.",
  },
  "pull-3": {
    duration: 28,
    steps: [
      "Cuerda a la altura de la cara y pulgares hacia ti.",
      "Tira hacia la frente abriendo los codos.",
      "Mantén 1 segundo atrás y vuelve despacio.",
    ],
    tip: "Hombros abajo y lejos de las orejas.",
  },
  "pull-4": {
    duration: 26,
    steps: [
      "Codos pegados al cuerpo y mancuernas hacia delante.",
      "Sube sin balancear hasta contraer el bíceps.",
      "Baja en 2-3 segundos hasta extender.",
    ],
    tip: "Si te ayudas con la espalda, el peso es excesivo.",
  },
  "glute-1": {
    duration: 36,
    steps: [
      "Espalda alta apoyada en el banco y barra sobre la cadera.",
      "Empuja con los talones hasta alinear rodillas, cadera y hombros.",
      "Aprieta los glúteos 1 segundo arriba y baja controlando.",
    ],
    tip: "Barbilla al pecho: evita arquear la zona lumbar.",
  },
  "glute-2": {
    duration: 34,
    steps: [
      "Pie trasero sobre el banco y pie delantero a un paso largo.",
      "Baja en vertical hasta que el muslo quede paralelo.",
      "Sube empujando con el talón delantero.",
    ],
    tip: "El peso va sobre la pierna de delante.",
  },
  "glute-3": {
    duration: 26,
    steps: [
      "Siéntate con la espalda apoyada y las rodillas a 90°.",
      "Abre las piernas con control, empujando con los glúteos.",
      "Vuelve despacio sin dejar caer el peso.",
    ],
    tip: "Sin impulso: sube y baja a ritmo constante.",
  },
  "glute-4": {
    duration: 28,
    steps: [
      "Tumbada, un pie apoyado y la otra pierna estirada.",
      "Eleva la cadera apretando el glúteo del pie apoyado.",
      "Baja sin tocar el suelo y repite.",
    ],
    tip: "Mantén la cadera nivelada, sin rotar.",
  },
};

/** Foto (provisional, de stock) que acompaña a cada rutina. */
export const workoutPhoto: Record<string, string> = {
  push: "/photos/mirror.jpg",
  lower: "/photos/group.jpg",
  pull: "/photos/coach.jpg",
  glute: "/photos/legs.jpg",
};

/** Encuadres distintos para que las miniaturas de una misma rutina no sean idénticas. */
export const photoPositions = ["50% 20%", "30% 40%", "70% 30%", "50% 60%", "20% 50%"];
