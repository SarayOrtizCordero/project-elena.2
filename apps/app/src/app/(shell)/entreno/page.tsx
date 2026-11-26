"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Timer, X } from "lucide-react";
import { cn } from "@elena/ui";
import { ExerciseCard } from "@/components/exercise-card";
import { useToast } from "@/components/toast";
import { workouts, type Exercise } from "@/lib/data";
import { todaysWorkout, useWorkoutProgress } from "@/lib/derive";
import { countSets, dayKey, useApp } from "@/lib/store";

export default function Entreno() {
  const [selected, setSelected] = useState(() => todaysWorkout().workout.id);
  const workout = workouts.find((w) => w.id === selected) ?? workouts[0];
  const prog = useWorkoutProgress(workout);
  const date = dayKey();
  const logs = useApp((s) => s.logs);
  const toast = useToast((s) => s.show);

  const [rest, setRest] = useState<{ name: string; left: number; total: number } | null>(null);

  // Se abre solo el primer ejercicio pendiente; si tocas otro, manda tu elección
  const [manual, setManual] = useState<string | null>(null);
  const pendingId = workout.exercises.find((e) => countSets(logs[`${date}:${e.id}`]) < e.sets)?.id;
  const openId = manual === "" ? undefined : (manual ?? pendingId);

  // Al pasar al siguiente ejercicio, lo trae a la vista
  const previousPending = useRef(pendingId);
  useEffect(() => {
    if (previousPending.current === pendingId) return;
    previousPending.current = pendingId;
    if (!pendingId) return;
    const t = setTimeout(() => document.getElementById(`ex-${pendingId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 320);
    return () => clearTimeout(t);
  }, [pendingId]);

  useEffect(() => {
    if (!rest) return;
    if (rest.left <= 0) {
      setRest(null);
      return;
    }
    const t = setTimeout(() => setRest((r) => (r ? { ...r, left: r.left - 1 } : r)), 1000);
    return () => clearTimeout(t);
  }, [rest]);

  function onLogged(ex: Exercise, remaining: number) {
    if (remaining > 0) {
      setManual(ex.id);
      setRest({ name: ex.name, left: ex.rest, total: ex.rest });
    } else {
      setManual(null);
      setRest(null);
      toast(`${ex.name}: completado`);
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
            onClick={() => {
              setSelected(w.id);
              setManual(null);
              previousPending.current = w.exercises.find((e) => countSets(logs[`${date}:${e.id}`]) < e.sets)?.id;
            }}
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

      <ul className={cn("space-y-3", rest && "pb-48 lg:pb-32")}>
        {workout.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            index={i}
            open={openId === ex.id}
            onToggle={() => setManual(openId === ex.id ? "" : ex.id)}
            onLogged={onLogged}
          />
        ))}
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
