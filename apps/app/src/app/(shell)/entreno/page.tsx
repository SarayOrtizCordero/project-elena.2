"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@elena/ui";
import { ExerciseCard } from "@/components/exercise-card";
import { useToast } from "@/components/toast";
import type { Exercise } from "@/lib/data";
import { todaysWorkout, useWorkoutProgress } from "@/lib/derive";
import { countSets, dayKey, useApp, usePlan } from "@/lib/store";

export default function Entreno() {
  const date = dayKey();
  const routine = useApp((s) => s.routine);
  const setRoutine = useApp((s) => s.setRoutine);
  const { workouts, days } = usePlan();
  const wanted = routine?.date === date ? routine.id : todaysWorkout({ workouts, days }).workout.id;
  const workout = workouts.find((w) => w.id === wanted) ?? workouts[0];
  const selected = workout.id;
  const prog = useWorkoutProgress(workout);
  const logs = useApp((s) => s.logs);
  const toast = useToast((s) => s.show);

  const resting = useApp((s) => s.rest !== null);
  const startRest = useApp((s) => s.startRest);
  const stopRest = useApp((s) => s.stopRest);

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

  function onLogged(ex: Exercise, remaining: number) {
    if (remaining > 0) {
      setManual(ex.id);
      startRest(ex.name, ex.rest);
    } else {
      setManual(null);
      stopRest();
      toast(`${ex.name}: completado`);
    }
  }

  const finished = prog.total > 0 && prog.done === prog.total;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Entre<span className="text-highlight">no</span>
        </h1>
        <p className="text-muted">{workout.focus}</p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Rutinas">
        {workouts.map((w) => (
          <button
            key={w.id}
            role="tab"
            aria-selected={w.id === selected}
            onClick={() => {
              setRoutine(w.id);
              setManual(null);
              previousPending.current = w.exercises.find((e) => countSets(logs[`${date}:${e.id}`]) < e.sets)?.id;
            }}
            className={cn(
              "h-11 shrink-0 rounded-full border px-5 font-display text-lg uppercase tracking-wide transition-colors",
              w.id === selected ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
            )}
          >
            {w.title}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-line bg-surface p-5">
        <div className="mb-2 flex items-end justify-between">
          <p className="font-display text-3xl leading-none">
            {prog.done}
            <span className="text-muted"> / {prog.total}</span> <span className="text-base text-muted">series</span>
          </p>
          <p className="text-sm text-muted">{workout.minutes} min</p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-raised">
          <motion.div
            className="h-full rounded-full bg-highlight"
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
            <div className="rounded-3xl bg-accent p-5 text-on-accent">
              <p className="font-display-tight text-3xl font-bold">¡Entreno completado!</p>
              <p className="text-sm text-on-accent/80">Gran trabajo. Descansa, come bien y registra tu peso esta semana.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className={cn("space-y-3", resting && "pb-48 lg:pb-32")}>
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
    </div>
  );
}
