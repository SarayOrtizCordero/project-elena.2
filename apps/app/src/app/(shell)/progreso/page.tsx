"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Camera } from "lucide-react";
import { Placeholder, cn } from "@elena/ui";
import { LineChart } from "@/components/line-chart";
import { Stepper } from "@/components/stepper";
import { useToast } from "@/components/toast";
import { clients } from "@/lib/data";
import { shortDate } from "@/lib/hooks";
import { DEMO_CLIENT, useApp } from "@/lib/store";

const ranges = [
  { id: "4", label: "4 sem", n: 5 },
  { id: "8", label: "8 sem", n: 9 },
  { id: "all", label: "Todo", n: Infinity },
] as const;

const measures = [
  { label: "Cintura", value: 74, delta: -3 },
  { label: "Cadera", value: 98, delta: -2 },
  { label: "Muslo", value: 56, delta: -1 },
];

export default function Progreso() {
  const weights = useApp((s) => s.weights);
  const addWeight = useApp((s) => s.addWeight);
  const toast = useToast((s) => s.show);
  const goal = clients.find((c) => c.id === DEMO_CLIENT)?.goal;
  const [range, setRange] = useState<(typeof ranges)[number]["id"]>("8");

  const last = weights[weights.length - 1]?.kg ?? 65;
  const [draft, setDraft] = useState<number | null>(null);
  const value = draft ?? last;

  const shown = useMemo(() => {
    const n = ranges.find((r) => r.id === range)!.n;
    return weights.slice(-n);
  }, [weights, range]);

  const first = shown[0]?.kg ?? last;
  const delta = last - first;
  // Subir de peso es buena noticia si el objetivo es ganar músculo
  const onTrack = goal === "Ganar músculo" ? delta >= 0 : delta <= 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Pro<span className="text-highlight">greso</span>
        </h1>
        <p className="text-muted">Tu evolución, semana a semana.</p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Evolución del peso">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-5xl leading-none">
              {last.toFixed(1)} <span className="text-xl text-muted">kg</span>
            </p>
            <p className={cn("mt-1 text-sm font-semibold", onTrack ? "text-ok" : "text-bad")}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg en este periodo
            </p>
          </div>
          <div className="flex rounded-full border border-line bg-canvas p-1" role="tablist" aria-label="Rango">
            {ranges.map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={range === r.id}
                onClick={() => setRange(r.id)}
                className={cn(
                  "relative h-9 rounded-full px-4 text-sm font-semibold transition-colors",
                  range === r.id ? "text-on-brand" : "text-muted",
                )}
              >
                {range === r.id && (
                  <motion.span
                    layoutId="range-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
        <LineChart key={range + shown.length} data={shown.map((w) => ({ label: shortDate(w.date), value: w.kg }))} />
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Registrar peso">
        <h2 className="font-display-tight mb-4 text-3xl font-bold">Registrar peso de hoy</h2>
        <Stepper label="Peso (kg)" value={value} onChange={setDraft} step={0.1} min={20} max={300} decimal className="mx-auto max-w-sm" />
        <p className="mt-2 text-center text-xs text-muted">Toca el número para escribirlo.</p>
        <button
          onClick={() => {
            addWeight(value);
            setDraft(null);
            toast(`Peso guardado: ${value.toFixed(1)} kg`);
          }}
          className="mt-4 h-12 w-full rounded-full bg-accent font-display text-lg uppercase tracking-wide text-on-accent transition active:scale-[0.97]"
        >
          Guardar
        </button>
      </section>

      <section aria-label="Medidas" className="grid grid-cols-3 gap-3">
        {measures.map((m) => (
          <div key={m.label} className="rounded-3xl border border-line bg-surface p-4">
            <p className="text-xs text-muted">{m.label}</p>
            <p className="font-display text-4xl leading-none">
              {m.value}
              <span className="text-base text-muted"> cm</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-ok">{m.delta} cm</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Fotos de progreso">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display-tight text-3xl font-bold">Fotos</h2>
          <button
            onClick={() => toast("Subida de fotos disponible en la versión final")}
            className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:border-highlight hover:text-highlight"
          >
            <Camera className="size-4" /> Añadir
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Semana 1", "Semana 4", "Semana 8"].map((l, i) => (
            <div key={l} className="overflow-hidden rounded-2xl border border-line">
              <Placeholder label={l} ratio="3/4" tone={i === 2 ? "accent" : "soft"} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
