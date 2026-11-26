"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@elena/ui";
import { weekDays, type Exercise, type Workout } from "@/lib/data";
import { dayNames } from "@/lib/menu";
import { exerciseCatalog, type ClientPlan } from "@/lib/plan";
import { dayKey, newId, useApp } from "@/lib/store";

const field = "h-11 w-full min-w-0 rounded-xl border border-line bg-canvas px-3 text-fg focus:border-highlight focus:outline-none";

/** Número que se puede borrar y volver a escribir; solo se guarda cuando es válido. */
function NumberField({ label, value, onChange, max, decimal }: { label: string; value: number; onChange: (n: number) => void; max: number; decimal?: boolean }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <label className="text-xs font-semibold uppercase tracking-wider text-muted">
      {label}
      <input
        type="text"
        inputMode={decimal ? "decimal" : "numeric"}
        value={text ?? String(value).replace(".", ",")}
        onFocus={(e) => e.target.select()}
        onBlur={() => setText(null)}
        onChange={(e) => {
          const raw = e.target.value;
          if (!(decimal ? /^\d{0,3}([.,]\d{0,2})?$/ : /^\d{0,3}$/).test(raw)) return;
          setText(raw);
          const n = Number(raw.replace(",", "."));
          if (raw !== "" && n <= max && (decimal || n >= 1 || label !== "Series")) onChange(n);
        }}
        className={cn(field, "mt-1 text-center font-display text-xl")}
      />
    </label>
  );
}

/**
 * Editor de una rutina (de una clienta o de una plantilla): días, ejercicios,
 * series, repeticiones, peso, descanso y vídeo.
 */
export function RoutineEditor({
  plan,
  onChange,
  lastText,
}: {
  plan: ClientPlan;
  onChange: (plan: ClientPlan) => void;
  /** Lo último que registró la clienta en un ejercicio */
  lastText?: (exercise: Exercise) => string | null;
}) {
  const videos = useApp((s) => s.videos);
  const [selected, setSelected] = useState<string | undefined>(plan.workouts[0]?.id);
  const [adding, setAdding] = useState("");
  const workout = plan.workouts.find((w) => w.id === selected) ?? plan.workouts[0];

  const update = (patch: Partial<Workout>) => {
    // Al añadir o quitar ejercicios se recalculan los músculos y la duración aproximada
    if (patch.exercises && patch.exercises.length !== workout.exercises.length) {
      patch.focus = [...new Set(patch.exercises.map((e) => e.muscle))].slice(0, 3).join(" · ");
      patch.minutes = 15 + patch.exercises.length * 8;
    }
    onChange({ ...plan, workouts: plan.workouts.map((w) => (w.id === workout.id ? { ...w, ...patch } : w)) });
  };

  // `setOn` avisa a la clienta de que Elena ha cambiado su objetivo
  const updateExercise = (index: number, patch: Partial<Exercise>) => {
    const target = "sets" in patch || "reps" in patch || "kg" in patch;
    update({ exercises: workout.exercises.map((e, i) => (i === index ? { ...e, ...patch, ...(target ? { setOn: dayKey() } : {}) } : e)) });
  };

  function addDay() {
    const id = newId("dia");
    onChange({ ...plan, workouts: [...plan.workouts, { id, title: `Día ${plan.workouts.length + 1}`, focus: "", minutes: 50, exercises: [] }] });
    setSelected(id);
  }

  function removeDay() {
    onChange({ days: plan.days.map((d) => (d === workout.id ? null : d)), workouts: plan.workouts.filter((w) => w.id !== workout.id) });
    setSelected(undefined);
  }

  function addExercise(value: string) {
    const known = exerciseCatalog.find((e) => e.id === value);
    if (known && workout.exercises.some((e) => e.id === known.id)) return;
    const exercise: Exercise = known
      ? { ...known, setOn: dayKey() }
      : { id: newId("ej"), name: "Ejercicio nuevo", muscle: "General", sets: 3, reps: "10", kg: 0, rest: 60, setOn: dayKey() };
    update({ exercises: [...workout.exercises, exercise] });
  }

  return (
    <div className="space-y-4">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Día de la rutina">
        {plan.workouts.map((w) => (
          <button
            key={w.id}
            type="button"
            aria-pressed={w.id === workout.id}
            onClick={() => setSelected(w.id)}
            className={cn("h-10 shrink-0 rounded-full border px-4 text-sm font-semibold", w.id === workout.id ? "border-brand bg-brand text-on-brand" : "border-line text-muted")}
          >
            {w.title || "Sin nombre"}
          </button>
        ))}
        <button type="button" onClick={addDay} className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-dashed border-line px-4 text-sm font-semibold">
          <Plus className="size-4" aria-hidden /> Día
        </button>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
        Nombre del día
        <input value={workout.title} onChange={(e) => update({ title: e.target.value })} className={cn(field, "mt-1 normal-case")} />
      </label>

      <fieldset>
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Qué días de la semana toca</legend>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((l, i) => {
            const on = plan.days[i] === workout.id;
            const other = plan.days[i] && !on;
            return (
              <button
                key={l}
                type="button"
                aria-pressed={on}
                aria-label={dayNames[i]}
                onClick={() => onChange({ ...plan, days: plan.days.map((d, j) => (j === i ? (on ? null : workout.id) : d)) })}
                className={cn("h-11 rounded-xl border text-sm font-bold", on ? "border-brand bg-brand text-on-brand" : other ? "border-line bg-raised text-muted" : "border-line")}
              >
                {l}
              </button>
            );
          })}
        </div>
      </fieldset>

      <ul className="space-y-3">
        {workout.exercises.map((e, i) => (
          <li key={`${workout.id}:${e.id}`} className="rounded-2xl bg-raised p-3">
            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wider text-muted">
                {e.muscle}
                <input value={e.name} onChange={(ev) => updateExercise(i, { name: ev.target.value })} aria-label="Nombre del ejercicio" className={cn(field, "mt-1 font-semibold normal-case")} />
              </label>
              <button
                type="button"
                onClick={() => update({ exercises: workout.exercises.filter((_, j) => j !== i) })}
                aria-label={`Quitar ${e.name}`}
                className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:text-bad"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <NumberField label="Series" value={e.sets} max={20} onChange={(sets) => updateExercise(i, { sets })} />
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Reps
                <input value={e.reps} onChange={(ev) => updateExercise(i, { reps: ev.target.value })} className={cn(field, "mt-1 px-1 text-center font-display text-xl normal-case")} />
              </label>
              <NumberField label="Kg" value={e.kg} max={999} decimal onChange={(kg) => updateExercise(i, { kg })} />
              <NumberField label="Desc. s" value={e.rest} max={900} onChange={(rest) => updateExercise(i, { rest })} />
            </div>
            {lastText?.(e) && <p className="mt-2 text-xs text-highlight">{lastText(e)}</p>}
            <label className="mt-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Vídeo
              <select value={e.videoId ?? ""} onChange={(ev) => updateExercise(i, { videoId: ev.target.value || undefined })} className={cn(field, "mt-1 normal-case")}>
                <option value="">{videos.length ? "Sin vídeo propio" : "Sube vídeos en la pestaña Vídeos"}</option>
                {videos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">Reps admite rangos (8-10) o tiempo (45 s).</p>

      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
        Añadir ejercicio
        <select
          value={adding}
          onChange={(e) => {
            if (e.target.value) addExercise(e.target.value);
            setAdding("");
          }}
          className={cn(field, "mt-1 normal-case")}
        >
          <option value="">Elige uno…</option>
          <option value="nuevo">+ Uno nuevo, escrito por mí</option>
          {exerciseCatalog.map((e) => (
            <option key={e.id} value={e.id} disabled={workout.exercises.some((x) => x.id === e.id)}>
              {e.name} ({e.muscle})
            </option>
          ))}
        </select>
      </label>

      {plan.workouts.length > 1 && (
        <button type="button" onClick={removeDay} className="mx-auto flex min-h-10 items-center gap-2 px-4 text-sm font-semibold text-muted hover:text-bad">
          <Trash2 className="size-4" aria-hidden /> Quitar el día “{workout.title}”
        </button>
      )}
    </div>
  );
}
