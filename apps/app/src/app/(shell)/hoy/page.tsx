"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Check, Flame, ShoppingBasket, TrendingDown, TrendingUp, X } from "lucide-react";
import { cn } from "@elena/ui";
import { dayLabel, timeLabel, useBonus } from "@/components/agenda-bits";
import { Bar, Ring } from "@/components/ring";
import { isPast, kinds, weekStatus } from "@/lib/agenda";
import { weekDays } from "@/lib/data";
import { todaysWorkout, useTargets, useTotals, useWorkoutProgress } from "@/lib/derive";
import { longDate } from "@/lib/hooks";
import { planForDate } from "@/lib/menu";
import { DEMO_CLIENT, countSets, dayKey, useApp, usePlan } from "@/lib/store";

const card = "rounded-3xl border border-line bg-surface p-5 sm:p-6";

export default function Hoy() {
  const totals = useTotals();
  const targets = useTargets();
  const plan = usePlan();
  const { workout, rest } = todaysWorkout(plan);
  const prog = useWorkoutProgress(workout);
  const logs = useApp((s) => s.logs);
  const appointments = useApp((s) => s.appointments);
  const weights = useApp((s) => s.weights);
  const planStart = useApp((s) => s.planStart);
  const setRoutine = useApp((s) => s.setRoutine);
  const bono = useBonus(DEMO_CLIENT);
  const { week } = planForDate(dayKey(), planStart);

  const first = weights[0]?.kg ?? 0;
  const now = weights[weights.length - 1]?.kg ?? 0;
  const delta = now - first;
  const remaining = Math.max(0, targets.kcal - totals.kcal);

  // Un día cuenta si se registró alguna serie o si se asistió a una cita
  const mine = appointments.filter((a) => a.clientId === DEMO_CLIENT && a.status === "booked");
  const active = new Set([
    ...Object.entries(logs).filter(([, list]) => countSets(list) > 0).map(([key]) => key.split(":")[0]),
    ...mine.filter((a) => isPast(a) && !a.returned).map((a) => a.start.slice(0, 10)),
  ]);
  const status = weekStatus(plan.days, active);
  const done = status.filter((s) => s === "done").length;
  const goal = Math.max(plan.days.filter(Boolean).length, done);
  const missed = status.includes("missed");
  const message = done >= goal && goal > 0 ? "¡Semana completa!" : done === 0 ? "Empieza hoy tu semana" : missed ? "Aún puedes remontar" : "¡Vas genial, sigue así!";

  const next = mine.filter((a) => !isPast(a)).sort((x, y) => x.start.localeCompare(y.start))[0];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">{longDate()}</p>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Hola, <span className="text-highlight">Lucía</span>
        </h1>
      </div>

      {/* Tu semana: lo primero que se ve */}
      <section className="rounded-3xl bg-brand p-5 text-on-brand sm:p-6" aria-label="Tu semana">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display-tight text-3xl font-extrabold sm:text-4xl">Tu semana</h2>
            <p className="mt-1 text-sm font-semibold">{message}</p>
          </div>
          <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-on-accent">
            <Flame className="size-5" aria-hidden />
            <span className="font-display text-2xl leading-none tabular-nums">
              {done}/{goal}
            </span>
            <span className="sr-only">días entrenados</span>
          </p>
        </div>
        <ul className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((d, i) => {
            const s = status[i];
            return (
              <li key={d} className="text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * i, type: "spring", stiffness: 380, damping: 22 }}
                  className={cn(
                    "mx-auto grid aspect-square w-full max-w-14 place-items-center rounded-2xl border-2 text-base font-bold",
                    s === "done" && "border-accent bg-accent text-on-accent",
                    s === "today" && "border-accent",
                    s === "todo" && "border-on-brand/35",
                    s === "missed" && "border-on-brand/35 text-on-brand/70",
                    s === "rest" && "border-dashed border-on-brand/35 text-on-brand/65",
                  )}
                >
                  {s === "done" ? <Check className="size-6" strokeWidth={3} aria-hidden /> : s === "missed" ? <X className="size-5" aria-hidden /> : d}
                </motion.div>
                <span className="mt-1 block text-[10px] font-semibold uppercase">
                  {d}
                  <span className="sr-only">
                    : {{ done: "hecho", missed: "sin entrenar", today: "hoy", todo: "pendiente", rest: "descanso" }[s]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Próxima cita */}
      <Link href="/citas" className={cn(card, "flex items-center gap-4 transition-colors hover:border-highlight")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-alt text-on-alt">
          <CalendarDays className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          {next ? (
            <>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-highlight">
                {next.unseen ? "Nueva cita de Elena" : "Tu próxima cita"}
              </span>
              <span className="block font-semibold">
                {dayLabel(next.start)} · {timeLabel(next.start)}
              </span>
              <span className="block text-sm text-muted">
                {kinds[next.kind]} · {bono.left === 1 ? "queda 1 sesión" : `quedan ${Math.max(0, bono.left)} sesiones`}
              </span>
            </>
          ) : (
            <>
              <span className="block font-display-tight text-2xl font-bold">Reserva tu cita</span>
              <span className="block text-sm text-muted">Sesiones presenciales con Elena</span>
            </>
          )}
        </span>
        {next?.unseen && <span className="size-3 shrink-0 animate-pulse rounded-full bg-highlight" aria-hidden />}
        <ArrowRight className="size-5 shrink-0 text-highlight" aria-hidden />
      </Link>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Entreno */}
        <section className={cn(card, "relative overflow-hidden")} aria-label="Entreno de hoy">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-highlight">
            {rest ? "Descanso · te proponemos" : "Entreno de hoy"}
          </p>
          <h2 className="font-display-tight mt-1 text-4xl font-bold">{workout.title}</h2>
          <p className="text-sm text-muted">
            {workout.focus} · {workout.minutes} min
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-raised">
            <motion.div className="h-full rounded-full bg-highlight" initial={{ width: 0 }} animate={{ width: `${prog.pct * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
          <p className="mt-2 text-xs text-muted">
            {prog.done} de {prog.total} series
          </p>
          <Link
            href="/entreno"
            onClick={() => setRoutine(null)}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 font-display text-base uppercase tracking-wide text-on-accent transition active:scale-95"
          >
            {prog.done > 0 ? "Continuar" : "Empezar"} <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Calorías */}
        <section className={card} aria-label="Calorías de hoy">
          <div className="flex items-center gap-5">
            <Ring value={totals.kcal} max={targets.kcal} size={130} stroke={12}>
              <div>
                <p className="font-display text-4xl leading-none">{Math.round(totals.kcal)}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted">kcal</p>
              </div>
            </Ring>
            <div className="flex-1">
              <p className="text-sm text-muted">Te quedan</p>
              <p className="font-display text-4xl leading-none text-highlight">{Math.round(remaining)}</p>
              <p className="text-sm text-muted">de {targets.kcal} kcal</p>
              <Link href="/comidas" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-highlight">
                Registrar comida <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Bar label="Proteína" value={totals.p} max={targets.p} tone="bg-pop-1" />
            <Bar label="Carbohidratos" value={totals.c} max={targets.c} tone="bg-pop-3" />
            <Bar label="Grasas" value={totals.f} max={targets.f} tone="bg-pop-4" />
          </div>
        </section>
      </div>

      {/* Peso */}
      <Link href="/progreso" className={cn(card, "flex items-center justify-between transition-colors hover:border-highlight")}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Peso actual</p>
          <p className="font-display text-5xl leading-none">
            {now.toFixed(1)} <span className="text-xl text-muted">kg</span>
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-raised px-4 py-2 text-sm font-semibold text-ok">
          {delta > 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          {delta > 0 ? "+" : ""}
          {delta.toFixed(1)} kg
        </span>
      </Link>

      {/* Compra */}
      <Link href="/comidas?vista=compra" className={cn(card, "flex items-center gap-4 transition-colors hover:border-highlight")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pop-2 text-canvas">
          <ShoppingBasket className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display-tight text-2xl font-bold">Lista de la compra</span>
          <span className="block text-sm text-muted">Semana {week + 1} · según tu menú</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-highlight" aria-hidden />
      </Link>
    </div>
  );
}
