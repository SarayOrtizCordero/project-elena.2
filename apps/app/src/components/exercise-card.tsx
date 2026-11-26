"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, History, Pencil, Play, Sparkles } from "lucide-react";
import { cn } from "@elena/ui";
import type { Exercise } from "@/lib/data";
import { shortDate } from "@/lib/hooks";
import { isTimed, sessionsOf, setText, suggestion } from "@/lib/sessions";
import { DEMO_CLIENT, countSets, dayKey, useApp, type SetList, type SetLog } from "@/lib/store";
import { Stepper, fmtNum } from "./stepper";
import { useToast } from "./toast";

type Props = {
  ex: Exercise;
  index: number;
  open: boolean;
  onToggle: () => void;
  /** Se llama al guardar una serie nueva; `remaining` son las que faltan en el ejercicio */
  onLogged: (ex: Exercise, remaining: number) => void;
};

const empty: SetList = [];

export function ExerciseCard({ ex, index, open, onToggle, onLogged }: Props) {
  const date = dayKey();
  const key = `${date}:${ex.id}`;
  const logs = useApp((s) => s.logs);
  const saveSet = useApp((s) => s.saveSet);
  const startKg = useApp((s) => s.startKg[`${DEMO_CLIENT}:${ex.id}`]) ?? ex.kg;
  const toast = useToast((s) => s.show);

  const today = logs[key] ?? empty;
  const previous = useMemo(() => sessionsOf(logs, ex.id).filter((s) => s.date < date), [logs, ex.id, date]);
  const last = previous[0];

  const done = Math.min(ex.sets, countSets(today));
  const complete = done === ex.sets;
  const pending = Array.from({ length: ex.sets }, (_, i) => i).find((i) => !today[i]);

  const [picked, setPicked] = useState<number | null>(null);
  const [history, setHistory] = useState(false);
  const active = picked ?? pending ?? null;

  function save(i: number, value: SetLog) {
    const isNew = !today[i];
    saveSet(key, i, value);
    setPicked(null);
    if (!isNew) return toast(`Serie ${i + 1} actualizada`);
    onLogged(ex, ex.sets - done - 1);
    // Deja la serie siguiente a la vista, por encima del temporizador de descanso
    setTimeout(() => document.getElementById(`editor-${ex.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
  }

  const panelId = `panel-${ex.id}`;

  return (
    <motion.li
      id={`ex-${ex.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-3xl border bg-ink-2 transition-colors",
        complete ? "border-volt/60" : open ? "border-bone/30" : "border-line",
      )}
    >
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
        >
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl font-display text-2xl",
              complete ? "bg-volt text-ink" : "bg-ink-3 text-volt",
            )}
          >
            {complete ? <Check className="size-6" aria-label="Completado" /> : index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">{ex.muscle}</span>
            <span className="block text-lg font-semibold leading-snug">{ex.name}</span>
            <span className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: ex.sets }, (_, i) => (
                <span key={i} aria-hidden className={cn("h-1.5 w-6 rounded-full", today[i] ? "bg-volt" : "bg-ink-3")} />
              ))}
              <span className="ml-1 text-xs tabular-nums text-mute">
                {done}/{ex.sets}
              </span>
            </span>
          </span>
          <ChevronDown className={cn("size-5 shrink-0 text-mute transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-line p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-mute">
                  Objetivo: {ex.sets} × {ex.reps} · descanso {ex.rest} s
                </p>
                <Link
                  href={`/videos?ex=${ex.id}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-bold uppercase tracking-wider text-volt hover:border-volt"
                >
                  <Play className="size-3.5 fill-current" aria-hidden /> Ver vídeo
                </Link>
              </div>

              {last ? (
                <p className="rounded-2xl bg-ink-3 px-4 py-3 text-sm">
                  <span className="font-semibold text-volt">Última vez</span> ({shortDate(last.date)}):{" "}
                  {last.sets.map((s) => (s.kg > 0 ? `${fmtNum(s.kg)}×${s.reps}` : `${s.reps}`)).join(" · ")}
                  {last.sets[0].kg > 0 ? <span className="text-mute"> (kg×reps)</span> : <span className="text-mute"> {isTimed(ex) ? "(segundos)" : "(reps)"}</span>}
                </p>
              ) : (
                <p className="flex items-start gap-3 rounded-2xl bg-ink-3 px-4 py-3 text-sm">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-volt" aria-hidden />
                  <span>
                    <span className="font-semibold text-volt">Primera vez.</span>{" "}
                    {startKg > 0 ? `Elena te propone empezar con ${fmtNum(startKg)} kg.` : "Empieza sin peso extra."} Después
                    apunta el que uses de verdad.
                  </span>
                </p>
              )}

              <ol className="space-y-2">
                {Array.from({ length: ex.sets }, (_, i) => {
                  const log = today[i];
                  const on = i === active;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setPicked(i)}
                        aria-current={on ? "step" : undefined}
                        className={cn(
                          "flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 text-left text-sm transition-colors",
                          on ? "border-volt bg-volt/10" : "border-line hover:border-bone/40",
                        )}
                      >
                        <span className="w-14 shrink-0 font-semibold">Serie {i + 1}</span>
                        <span className={cn("flex-1 tabular-nums", !log && "text-mute")}>
                          {log ? setText(log, ex) : on ? "Ahora" : "Pendiente"}
                        </span>
                        {log && (
                          <>
                            <Pencil className="size-4 text-mute" aria-label="Editar" />
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="grid size-7 place-items-center rounded-full bg-volt text-ink"
                            >
                              <Check className="size-4" aria-label="Hecha" />
                            </motion.span>
                          </>
                        )}
                      </button>
                      {on && (
                        <SetEditor
                          id={`editor-${ex.id}`}
                          key={`${i}-${log ? "edit" : "new"}-${startKg}`}
                          number={i + 1}
                          timed={isTimed(ex)}
                          editing={!!log}
                          initial={log ?? suggestion(ex, i, today, last, startKg)}
                          onSave={(v) => save(i, v)}
                          onDelete={() => {
                            saveSet(key, i, null);
                            setPicked(null);
                          }}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>

              {previous.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setHistory((h) => !h)}
                    aria-expanded={history}
                    className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-mute hover:text-bone"
                  >
                    <History className="size-4" aria-hidden /> {history ? "Ocultar historial" : "Ver historial"}
                  </button>
                  {history && (
                    <ul className="mt-2 divide-y divide-line rounded-2xl border border-line px-4">
                      {previous.slice(0, 4).map((s) => (
                        <li key={s.date} className="py-3 text-sm">
                          <p className="font-semibold">{shortDate(s.date)}</p>
                          <p className="text-mute">{s.sets.map((x) => setText(x, ex)).join(" · ")}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function SetEditor({
  id,
  number,
  timed,
  editing,
  initial,
  onSave,
  onDelete,
}: {
  id: string;
  number: number;
  timed: boolean;
  editing: boolean;
  initial: SetLog;
  onSave: (v: SetLog) => void;
  onDelete: () => void;
}) {
  const [kg, setKg] = useState(initial.kg);
  const [reps, setReps] = useState(initial.reps);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ kg, reps });
      }}
      id={id}
      className="scroll-mb-52 scroll-mt-24 space-y-3 pb-2 pt-3 lg:scroll-mb-40"
    >
      <div className="grid grid-cols-2 gap-3">
        <Stepper label="Peso (kg)" value={kg} onChange={setKg} step={1} decimal />
        <Stepper label={timed ? "Segundos" : "Reps"} value={reps} onChange={setReps} step={timed ? 5 : 1} min={1} />
      </div>
      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-volt font-display text-lg uppercase tracking-wide text-ink transition active:scale-[0.97]"
      >
        <Check className="size-5" aria-hidden /> {editing ? `Guardar cambios` : `Guardar serie ${number}`}
      </button>
      {editing && (
        <button type="button" onClick={onDelete} className="mx-auto block min-h-10 px-4 text-sm font-semibold text-mute hover:text-bad">
          Borrar serie {number}
        </button>
      )}
    </form>
  );
}
