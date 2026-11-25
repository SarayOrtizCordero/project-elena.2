"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Play, Timer, X } from "lucide-react";
import { cn } from "@elena/ui";
import { workouts, type Exercise } from "@/lib/data";
import { todaysWorkout, useWorkoutProgress } from "@/lib/derive";
import { dayKey, useApp } from "@/lib/store";

export default function Entreno() {
  const [selected, setSelected] = useState(() => todaysWorkout().workout.id);
  const workout = workouts.find((w) => w.id === selected) ?? workouts[0];
  const prog = useWorkoutProgress(workout);
  const date = dayKey();
  const sets = useApp((s) => s.sets);
  const setSets = useApp((s) => s.setSets);

  const [rest, setRest] = useState<{ name: string; left: number; total: number } | null>(null);

  useEffect(() => {
    if (!rest) return;
    if (rest.left <= 0) {
      setRest(null);
      return;
    }
    const t = setTimeout(() => setRest((r) => (r ? { ...r, left: r.left - 1 } : r)), 1000);
    return () => clearTimeout(t);
  }, [rest]);

  function tapSet(ex: Exercise, n: number) {
    const key = `${date}:${ex.id}`;
    const done = sets[key] ?? 0;
    if (n <= done) {
      setSets(key, n - 1);
    } else {
      setSets(key, n);
      if (n < ex.sets) setRest({ name: ex.name, left: ex.rest, total: ex.rest });
      else setRest(null);
    }
  }

  const finished = prog.total > 0 && prog.done === prog.total;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Entre<span className="text-volt">no</span>
        </h1>
        <p className="text-mute">{workout.focus}</p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Rutinas">
        {workouts.map((w) => (
          <button
            key={w.id}
            role="tab"
            aria-selected={w.id === selected}
            onClick={() => setSelected(w.id)}
            className={cn(
              "h-11 shrink-0 rounded-full border px-5 font-display text-lg uppercase tracking-wide transition-colors",
              w.id === selected ? "border-volt bg-volt text-ink" : "border-line text-mute hover:text-bone",
            )}
          >
            {w.title}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-line bg-ink-2 p-5">
        <div className="mb-2 flex items-end justify-between">
          <p className="font-display text-3xl leading-none">
            {prog.done}
            <span className="text-mute"> / {prog.total}</span> <span className="text-base text-mute">series</span>
          </p>
          <p className="text-sm text-mute">{workout.minutes} min</p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink-3">
          <motion.div
            className="h-full rounded-full bg-volt"
            animate={{ width: `${prog.pct * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-3xl bg-volt p-5 text-ink">
              <p className="font-display-tight text-3xl font-bold">¡Entreno completado!</p>
              <p className="text-sm text-ink/80">Gran trabajo. Descansa, come bien y registra tu peso esta semana.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="space-y-3">
        {workout.exercises.map((ex, i) => {
          const done = Math.min(ex.sets, sets[`${date}:${ex.id}`] ?? 0);
          const complete = done === ex.sets;
          return (
            <motion.li
              key={ex.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "rounded-3xl border bg-ink-2 p-5 transition-colors",
                complete ? "border-volt/60" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">{ex.muscle}</p>
                  <h2 className="text-lg font-semibold leading-snug">{ex.name}</h2>
                  <Link href={`/videos?ex=${ex.id}`} className="mt-1 inline-flex min-h-8 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-volt">
                    <Play className="size-3.5 fill-current" aria-hidden /> Ver vídeo
                  </Link>
                  <p className="mt-1 text-sm text-mute">
                    {ex.sets} × {ex.reps}
                    {ex.kg > 0 && <> · {ex.kg} kg</>} · descanso {ex.rest}s
                  </p>
                </div>
                {complete && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-volt text-ink">
                    <Check className="size-5" />
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: ex.sets }).map((_, k) => {
                  const n = k + 1;
                  const on = n <= done;
                  return (
                    <motion.button
                      key={n}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => tapSet(ex, n)}
                      aria-pressed={on}
                      aria-label={`Serie ${n} de ${ex.name}`}
                      className={cn(
                        "grid size-12 place-items-center rounded-2xl border font-display text-xl transition-colors",
                        on ? "border-volt bg-volt text-ink" : "border-line text-mute hover:border-bone",
                      )}
                    >
                      {on ? <Check className="size-5" /> : n}
                    </motion.button>
                  );
                })}
              </div>
            </motion.li>
          );
        })}
      </ul>

      {/* Temporizador de descanso */}
      <AnimatePresence>
        {rest && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md overflow-hidden glass-strong rounded-3xl !border-volt shadow-2xl lg:bottom-8 lg:left-auto lg:right-8"
          >
            <div className="flex items-center gap-4 p-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-volt text-ink">
                <Timer className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-mute">Descanso · {rest.name}</p>
                <p className="font-display text-4xl leading-none tabular-nums">
                  {Math.floor(rest.left / 60)}:{String(rest.left % 60).padStart(2, "0")}
                </p>
              </div>
              <button
                onClick={() => setRest(null)}
                aria-label="Saltar descanso"
                className="grid size-10 place-items-center rounded-full border border-line text-mute hover:text-bone"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="h-1 bg-ink">
              <div
                className="h-full bg-volt transition-[width] duration-1000 ease-linear"
                style={{ width: `${(rest.left / rest.total) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
