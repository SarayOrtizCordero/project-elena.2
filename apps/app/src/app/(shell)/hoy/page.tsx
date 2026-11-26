"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Flame, ShoppingBasket, TrendingDown } from "lucide-react";
import { cn } from "@elena/ui";
import { Bar, Ring } from "@/components/ring";
import { targets, weekDays, weekPlan } from "@/lib/data";
import { todaysWorkout, useTotals, useWorkoutProgress } from "@/lib/derive";
import { longDate } from "@/lib/hooks";
import { planForDate } from "@/lib/menu";
import { dayKey, useApp } from "@/lib/store";

const card = "rounded-3xl border border-line bg-ink-2 p-5 sm:p-6";

export default function Hoy() {
  const totals = useTotals();
  const { workout, rest } = todaysWorkout();
  const prog = useWorkoutProgress(workout);
  const weights = useApp((s) => s.weights);
  const planStart = useApp((s) => s.planStart);
  const { week } = planForDate(dayKey(), planStart);

  const first = weights[0]?.kg ?? 0;
  const now = weights[weights.length - 1]?.kg ?? 0;
  const delta = now - first;
  const remaining = Math.max(0, targets.kcal - totals.kcal);

  const todayIdx = (new Date().getDay() + 6) % 7;
  // Semana demo: días pasados con rutina → completados
  const dayState = weekDays.map((_, i) => {
    if (!weekPlan[i]) return "rest" as const;
    if (i < todayIdx) return "done" as const;
    if (i === todayIdx) return prog.pct >= 1 ? ("done" as const) : ("today" as const);
    return "todo" as const;
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-mute">{longDate()}</p>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Hola, <span className="text-volt">Lucía</span>
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Calorías */}
        <section className={card} aria-label="Calorías de hoy">
          <div className="flex items-center gap-5">
            <Ring value={totals.kcal} max={targets.kcal} size={150} stroke={13}>
              <div>
                <p className="font-display text-4xl leading-none">{Math.round(totals.kcal)}</p>
                <p className="text-[11px] uppercase tracking-widest text-mute">kcal</p>
              </div>
            </Ring>
            <div className="flex-1">
              <p className="text-sm text-mute">Te quedan</p>
              <p className="font-display text-4xl leading-none text-volt">{Math.round(remaining)}</p>
              <p className="text-sm text-mute">de {targets.kcal} kcal</p>
              <Link href="/comidas" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-volt">
                Registrar comida <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Bar label="Proteína" value={totals.p} max={targets.p} />
            <Bar label="Carbohidratos" value={totals.c} max={targets.c} />
            <Bar label="Grasas" value={totals.f} max={targets.f} />
          </div>
        </section>

        <div className="space-y-5">
          {/* Entreno */}
          <section className={cn(card, "relative overflow-hidden")} aria-label="Entreno de hoy">
            <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-volt/10 blur-2xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-volt">
              {rest ? "Descanso · te proponemos" : "Entreno de hoy"}
            </p>
            <h2 className="font-display-tight mt-1 text-4xl font-bold">{workout.title}</h2>
            <p className="text-sm text-mute">
              {workout.focus} · {workout.minutes} min
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-3">
              <motion.div
                className="h-full rounded-full bg-volt"
                initial={{ width: 0 }}
                animate={{ width: `${prog.pct * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="mt-2 text-xs text-mute">
              {prog.done} de {prog.total} series
            </p>
            <Link
              href="/entreno"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-volt px-6 font-display text-base uppercase tracking-wide text-ink transition active:scale-95"
            >
              {prog.done > 0 ? "Continuar" : "Empezar"} <ArrowRight className="size-4" />
            </Link>
          </section>

          {/* Peso */}
          <Link href="/progreso" className={cn(card, "flex items-center justify-between transition-colors hover:border-volt/60")}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">Peso actual</p>
              <p className="font-display text-5xl leading-none">
                {now.toFixed(1)} <span className="text-xl text-mute">kg</span>
              </p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-ink-3 px-4 py-2 text-sm font-semibold text-volt">
              <TrendingDown className="size-4" />
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg
            </span>
          </Link>
        </div>
      </div>

      {/* Compra */}
      <Link href="/comidas?vista=compra" className={cn(card, "flex items-center gap-4 transition-colors hover:border-volt/60")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-volt text-ink">
          <ShoppingBasket className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display-tight text-2xl font-bold">Lista de la compra</span>
          <span className="block text-sm text-mute">Semana {week + 1} · según tu menú</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-volt" aria-hidden />
      </Link>

      {/* Semana */}
      <section className={card} aria-label="Tu semana">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display-tight text-2xl font-bold">Tu semana</h2>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-volt">
            <Flame className="size-4" /> Racha de 3 semanas
          </span>
        </div>
        <ul className="grid grid-cols-7 gap-2">
          {weekDays.map((d, i) => {
            const s = dayState[i];
            return (
              <li key={d} className="text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * i, type: "spring", stiffness: 380, damping: 22 }}
                  className={cn(
                    "mx-auto grid aspect-square w-full max-w-12 place-items-center rounded-2xl border text-sm font-bold",
                    s === "done" && "border-volt bg-volt text-ink",
                    s === "today" && "border-volt text-volt animate-pulse-ring",
                    s === "todo" && "border-line text-mute",
                    s === "rest" && "border-dashed border-line text-mute/50",
                  )}
                >
                  {s === "done" ? "✓" : d}
                </motion.div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
