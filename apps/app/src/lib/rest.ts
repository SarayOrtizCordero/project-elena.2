/** Descanso en marcha. Se guarda la hora de fin para que no se retrase si el móvil frena la app. */
export type Rest = { name: string; total: number; endsAt: number };

/** Segundos que quedan de descanso. */
export const restLeft = (rest: Rest, now: number = Date.now()) => Math.max(0, Math.ceil((rest.endsAt - now) / 1000));
