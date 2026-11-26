"use client";

import { useState } from "react";
import { Copy, Dumbbell, Pencil, Plus, Trash2, Utensils } from "lucide-react";
import { cn } from "@elena/ui";
import { RoutineEditor } from "@/components/routine-editor";
import { useToast } from "@/components/toast";
import { clients } from "@/lib/data";
import { clonePlan, type Template } from "@/lib/plan";
import { newId, useApp } from "@/lib/store";

const field = "h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-fg focus:border-highlight focus:outline-none";
const macros = [
  ["kcal", "Kcal"],
  ["p", "Proteína g"],
  ["c", "Carbos g"],
  ["f", "Grasas g"],
] as const;

export default function Plantillas() {
  const templates = useApp((s) => s.templates);
  const save = useApp((s) => s.saveTemplate);
  const remove = useApp((s) => s.removeTemplate);
  const assign = useApp((s) => s.assignTemplate);
  const toast = useToast((s) => s.show);
  const [kind, setKind] = useState<Template["kind"]>("Rutina");
  const [editing, setEditing] = useState<string | null>(null);

  const list = templates.filter((t) => t.kind === kind);

  function create() {
    const id = newId("t");
    if (kind === "Rutina") {
      const day = newId("dia");
      save({
        id,
        kind,
        name: "Rutina nueva",
        plan: { days: [day, null, null, null, null, null, null], workouts: [{ id: day, title: "Día 1", focus: "", minutes: 50, exercises: [] }] },
      });
    } else save({ id, kind, name: "Comidas nuevas", targets: { kcal: 2000, p: 130, c: 210, f: 70 } });
    setEditing(id);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Planti<span className="text-highlight">llas</span>
        </h1>
        <p className="text-muted">Prepáralas una vez y asígnalas a quien quieras.</p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-line bg-surface p-1" role="tablist" aria-label="Tipo de plantilla">
        {(["Rutina", "Comidas"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={kind === k}
            onClick={() => {
              setKind(k);
              setEditing(null);
            }}
            className={cn("h-11 rounded-full text-sm font-semibold", kind === k ? "bg-brand text-on-brand" : "text-muted")}
          >
            {k === "Rutina" ? "Rutinas" : "Comidas"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={create}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-lg uppercase tracking-wide text-on-accent active:scale-[0.97]"
      >
        <Plus className="size-5" aria-hidden /> Nueva plantilla
      </button>

      {!list.length && <p className="py-6 text-center text-muted">Aún no tienes plantillas de este tipo.</p>}

      <ul className="space-y-3">
        {list.map((t) => {
          const open = editing === t.id;
          return (
            <li key={t.id} className={cn("rounded-3xl border bg-surface p-5", open ? "border-highlight" : "border-line")}>
              <div className="flex items-start gap-3">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl text-canvas", t.kind === "Rutina" ? "bg-pop-3" : "bg-pop-2")}>
                  {t.kind === "Rutina" ? <Dumbbell className="size-5" aria-hidden /> : <Utensils className="size-5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold leading-snug">{t.name}</h2>
                  <p className="text-sm text-muted">
                    {t.kind === "Rutina"
                      ? `${t.plan.days.filter(Boolean).length} días por semana · ${t.plan.workouts.reduce((n, w) => n + w.exercises.length, 0)} ejercicios`
                      : `${t.targets.kcal} kcal · P ${t.targets.p} · C ${t.targets.c} · G ${t.targets.f}`}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <select
                  value=""
                  aria-label={`Asignar ${t.name} a un cliente`}
                  onChange={(e) => {
                    const c = clients.find((x) => x.id === e.target.value);
                    if (!c) return;
                    if (t.kind === "Rutina" && !window.confirm(`¿Sustituir la rutina de ${c.name} por “${t.name}”?`)) return;
                    assign(t.id, c.id);
                    toast(`Asignada a ${c.name.split(" ")[0]}`);
                  }}
                  className="h-11 min-w-0 flex-1 rounded-full border border-accent bg-accent px-4 text-sm font-bold text-on-accent"
                >
                  <option value="">Asignar a…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setEditing(open ? null : t.id)} aria-expanded={open} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold">
                  <Pencil className="size-4" aria-hidden /> {open ? "Cerrar" : "Editar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const copy: Template =
                      t.kind === "Rutina"
                        ? { ...t, id: newId("t"), name: `${t.name} (copia)`, plan: clonePlan(t.plan) }
                        : { ...t, id: newId("t"), name: `${t.name} (copia)`, targets: { ...t.targets } };
                    save(copy);
                    setEditing(copy.id);
                  }}
                  aria-label={`Duplicar ${t.name}`}
                  className="grid size-11 place-items-center rounded-full border border-line"
                >
                  <Copy className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm(`¿Borrar la plantilla “${t.name}”?`) && remove(t.id)}
                  aria-label={`Borrar ${t.name}`}
                  className="grid size-11 place-items-center rounded-full border border-line text-muted hover:text-bad"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {open && (
                <div className="mt-5 space-y-4 border-t border-line pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Nombre de la plantilla
                    <input value={t.name} onChange={(e) => save({ ...t, name: e.target.value })} className={cn(field, "mt-1 normal-case")} />
                  </label>
                  {t.kind === "Rutina" ? (
                    <RoutineEditor plan={t.plan} onChange={(plan) => save({ ...t, plan })} />
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {macros.map(([key, label]) => (
                        <label key={key} className="text-xs font-semibold uppercase tracking-wider text-muted">
                          {label}
                          <input
                            inputMode="numeric"
                            value={t.targets[key] || ""}
                            onChange={(e) => save({ ...t, targets: { ...t.targets, [key]: Number(e.target.value.replace(/\D/g, "").slice(0, 5)) } })}
                            className={cn(field, "mt-1")}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted">Los cambios no afectan a quien ya la tenga: vuelve a asignársela.</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
