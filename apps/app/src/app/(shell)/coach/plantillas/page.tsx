"use client";

import { motion } from "motion/react";
import { Dumbbell, Utensils } from "lucide-react";
import { useToast } from "@/components/toast";
import { templates } from "@/lib/data";

export default function Plantillas() {
  const toast = useToast((s) => s.show);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Planti<span className="text-volt">llas</span>
        </h1>
        <p className="text-mute">Rutinas y planes de comida reutilizables.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {templates.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex flex-col rounded-3xl border border-line bg-ink-2 p-5"
          >
            <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-ink-3 text-volt">
              {t.kind === "Rutina" ? <Dumbbell className="size-5" /> : <Utensils className="size-5" />}
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">{t.kind}</p>
            <h2 className="mt-1 flex-1 text-lg font-semibold">{t.name}</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-mute">{t.uses} clientes</span>
              <button
                onClick={() => toast(`"${t.name}" asignada (demo)`)}
                className="h-10 rounded-full bg-volt px-5 font-display text-base uppercase tracking-wide text-ink transition active:scale-95"
              >
                Asignar
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
