"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { cn } from "@elena/ui";
import { ClientBonus } from "@/components/client-bonus";
import { LineChart } from "@/components/line-chart";
import { RoutineEditor } from "@/components/routine-editor";
import { useToast } from "@/components/toast";
import { clients } from "@/lib/data";
import { useTargets } from "@/lib/derive";
import { shortDate } from "@/lib/hooks";
import { sessionsOf, setText } from "@/lib/sessions";
import { DEMO_CLIENT, useApp, usePlan } from "@/lib/store";
import { adherenceTone } from "@/lib/tone";

const card = "rounded-3xl border border-line bg-surface p-5";
const field = "h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-fg focus:border-highlight focus:outline-none";

export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast((s) => s.show);
  const plan = usePlan(id);
  const targets = useTargets(id);
  const setPlan = useApp((s) => s.setPlan);
  const templates = useApp((s) => s.templates);
  const assigned = useApp((s) => s.assigned[id]);
  const assignTemplate = useApp((s) => s.assignTemplate);
  const logs = useApp((s) => s.logs);
  const weights = useApp((s) => s.weights);
  const c = clients.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Cliente no encontrado.</p>
        <Link href="/coach" className="mt-4 inline-block text-highlight underline">
          Volver al panel
        </Link>
      </div>
    );
  }

  const first = c.name.split(" ")[0];
  // En la demo solo hay registros reales de una clienta
  const real = c.id === DEMO_CLIENT;
  const data = real
    ? weights.slice(-9).map((w) => ({ label: shortDate(w.date), value: w.kg }))
    : c.trend.map((v, i) => ({ label: `S${i + 1}`, value: v }));
  const delta = data.length ? data[data.length - 1].value - data[0].value : 0;

  return (
    <div className="space-y-5">
      <Link href="/coach" className="inline-flex items-center gap-1 text-sm text-muted hover:text-highlight">
        <ChevronLeft className="size-4" /> Panel
      </Link>

      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-brand font-display text-4xl text-on-brand">{c.name[0]}</span>
        <div>
          <h1 className="font-display-tight text-4xl font-extrabold sm:text-5xl">{c.name}</h1>
          <p className="text-sm text-muted">
            {c.mode} · {c.goal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={cn(card, "!p-4")}>
          <p className="text-xs text-muted">Adherencia</p>
          <p className={cn("font-display text-4xl leading-none", adherenceTone(c.adherence))}>{c.adherence}%</p>
        </div>
        <div className={cn(card, "!p-4")}>
          <p className="text-xs text-muted">Último registro</p>
          <p className="font-display text-4xl leading-none">{c.lastDays === 0 ? "Hoy" : `${c.lastDays} d`}</p>
        </div>
        <div className={cn(card, "!p-4")}>
          <p className="text-xs text-muted">Cambio peso</p>
          <p className="font-display text-4xl leading-none">
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
            <span className="text-base text-muted"> kg</span>
          </p>
        </div>
      </div>

      <ClientBonus clientId={c.id} firstName={first} />

      <section className={card} aria-label="Su rutina">
        <h2 className="font-display-tight text-3xl font-bold">Su rutina</h2>
        <p className="mb-4 text-sm text-muted">Los cambios se guardan solos y le salen en su app.</p>

        <label className="mb-5 block text-sm text-muted">
          {assigned?.Rutina ? `Plantilla asignada: ${assigned.Rutina}` : "Cargar una plantilla (sustituye su rutina)"}
          <select
            value=""
            onChange={(e) => {
              const t = templates.find((x) => x.id === e.target.value);
              if (!t || !window.confirm(`¿Sustituir la rutina de ${first} por “${t.name}”?`)) return;
              assignTemplate(t.id, c.id);
              toast(`Plantilla asignada a ${first}`);
            }}
            className={cn(field, "mt-1")}
          >
            <option value="">Elegir plantilla…</option>
            {templates
              .filter((t) => t.kind === "Rutina")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </label>

        <RoutineEditor
          key={`${c.id}:${assigned?.Rutina ?? ""}`}
          plan={plan}
          onChange={(next) => setPlan(c.id, next)}
          lastText={
            real
              ? (exercise) => {
                  const last = sessionsOf(logs, exercise.id)[0];
                  return last ? `Último registro (${shortDate(last.date)}): ${last.sets.map((s) => setText(s, exercise)).join(" · ")}` : null;
                }
              : undefined
          }
        />
      </section>

      <section className={card} aria-label="Comidas">
        <h2 className="font-display-tight text-3xl font-bold">Comidas</h2>
        <p className="text-sm text-muted">
          {targets.kcal} kcal · P {targets.p} g · C {targets.c} g · G {targets.f} g
        </p>
        <label className="mt-3 block text-sm text-muted">
          {assigned?.Comidas ? `Plantilla asignada: ${assigned.Comidas}` : "Asignar plantilla de comidas"}
          <select
            value=""
            onChange={(e) => {
              if (!e.target.value) return;
              assignTemplate(e.target.value, c.id);
              toast(`Objetivos de comida actualizados para ${first}`);
            }}
            className={cn(field, "mt-1")}
          >
            <option value="">Elegir plantilla…</option>
            {templates
              .filter((t) => t.kind === "Comidas")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </label>
      </section>

      <section className={card} aria-label="Evolución">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">Evolución del peso</h2>
        <LineChart data={data} />
      </section>

      <section className={card} aria-label="Nota">
        <h2 className="font-display-tight mb-2 text-3xl font-bold">Nota de la semana</h2>
        <p className="text-muted">{c.note}</p>
      </section>

      <button
        onClick={() => toast(`Mensaje enviado a ${first} (demo)`)}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-lg uppercase tracking-wide text-on-accent transition active:scale-[0.97]"
      >
        <MessageCircle className="size-5" /> Enviar mensaje
      </button>
    </div>
  );
}
