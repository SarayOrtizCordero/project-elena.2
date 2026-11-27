"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button, Reveal, RevealText, cn } from "@elena/ui";
import { bonos, options, periods } from "@/lib/data";

const eur = (n: number) => `${n} €`;

export function Plans() {
  const [id, setId] = useState<(typeof options)[number]["id"]>("lanzamiento");
  const option = options.find((o) => o.id === id) ?? options[0];
  const normal = options.find((o) => o.id === "pack");
  const monthly = option.prices[1] ?? 0;
  const rows = periods.filter((p) => option.prices[p.months] !== undefined);

  return (
    <section id="planes" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
            <span className="h-px w-8 bg-highlight" /> Planes
          </p>
          <RevealText as="h2" text="Elige tu *ritmo*" className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
        </div>
      </Reveal>

      <div role="tablist" aria-label="Tipo de plan" className="mb-8 grid grid-cols-2 gap-1 rounded-3xl border border-line bg-surface p-1 md:grid-cols-4 md:rounded-full">
        {options.map((o) => (
          <button
            key={o.id}
            role="tab"
            aria-selected={id === o.id}
            onClick={() => setId(o.id)}
            className={cn(
              "relative h-12 rounded-full px-2 font-display text-base uppercase tracking-wide transition-colors sm:text-lg",
              id === o.id ? "text-on-brand" : "text-muted hover:text-fg",
            )}
          >
            {id === o.id && (
              <motion.span
                layoutId="plan-pill"
                className="absolute inset-0 -z-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.tab}</span>
          </button>
        ))}
      </div>

      <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h3 className="font-display-tight text-3xl font-bold sm:text-4xl">{option.title}</h3>
          {option.badge && (
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">{option.badge}</span>
          )}
        </div>
        <p className="mb-8 max-w-2xl text-muted">{option.lead}</p>

        <div className={cn("grid gap-5 sm:grid-cols-2", rows.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {rows.map((r) => {
            const price = option.prices[r.months] as number;
            const saving = monthly * r.months - price;
            const regular = option.id === "lanzamiento" ? normal?.prices[r.months] : undefined;
            const launch = option.id === "lanzamiento";
            return (
              <article
                key={r.months}
                className={cn("flex flex-col rounded-3xl border p-6", launch ? "border-brand bg-brand text-on-brand" : "glass")}
              >
                <h4 className="font-display text-2xl uppercase tracking-wide">{r.label}</h4>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-6xl leading-none">{eur(price)}</span>
                  <span className={cn("text-sm", launch ? "text-on-brand/80" : "text-muted")}>{r.unit}</span>
                </p>
                <p className={cn("mt-2 min-h-5 text-sm", launch ? "text-on-brand/80" : "text-muted")}>
                  {regular ? `Precio normal: ${eur(regular)}` : saving > 0 ? `Ahorras ${eur(saving)} frente al mensual` : ""}
                </p>
                <Button href="#contacto" variant={launch ? "primary" : "dark"} className="mt-6 w-full">
                  Empezar
                </Button>
              </article>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {option.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-20">
        <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
          <span className="h-px w-8 bg-highlight" /> Presencial
        </p>
        <h3 className="font-display-tight text-4xl font-extrabold sm:text-5xl">Bonos de entreno personal</h3>
        <p className="mt-3 max-w-2xl text-muted">Sesiones en sala con Elena. Pagas el bono una vez y reservas tus citas desde la app.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {bonos.map((b) => (
            <article
              key={b.name}
              className={cn("relative flex flex-col rounded-3xl border p-7", b.featured ? "border-brand bg-brand text-on-brand" : "glass")}
            >
              {b.badge && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-accent">
                  {b.badge}
                </span>
              )}
              <h4 className="font-display-tight text-4xl font-bold">{b.name}</h4>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-6xl leading-none">{eur(b.price)}</span>
                <span className={cn("text-sm", b.featured ? "text-on-brand/80" : "text-muted")}>{b.sessions} sesiones</span>
              </p>
              <p className={cn("mt-2 text-sm", b.featured ? "text-on-brand/80" : "text-muted")}>
                {(b.price / b.sessions).toLocaleString("es-ES", { maximumFractionDigits: 2 })} € por sesión
              </p>
              <Button href="#contacto" variant={b.featured ? "primary" : "dark"} className="mt-6 w-full">
                Reservar bono
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
