"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button, Reveal, RevealText, cn } from "@elena/ui";
import { plans } from "@/lib/data";

const tabs = [
  { id: "presencial", label: "Personal" },
  { id: "online", label: "Online" },
  { id: "nutricion", label: "Nutrición" },
  { id: "combo", label: "Combo" },
] as const;

export function Plans() {
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("online");

  return (
    <section id="planes" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
              <span className="h-px w-8 bg-highlight" /> Planes
            </p>
            <RevealText as="h2" text="Elige tu *ritmo*" className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
          </div>

          <div role="tablist" aria-label="Modalidad" className="relative flex w-full rounded-full md:w-auto border border-line bg-surface p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={mode === t.id}
                onClick={() => setMode(t.id)}
                className={cn(
                  "relative z-10 h-11 flex-1 rounded-full px-1 font-display text-sm uppercase tracking-wide transition-colors min-[400px]:text-base sm:px-6 sm:text-lg md:flex-none",
                  mode === t.id ? "text-on-accent" : "text-muted hover:text-fg",
                )}
              >
                {mode === t.id && (
                  <motion.span
                    layoutId="plan-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid gap-5 md:grid-cols-3"
      >
        {plans[mode].map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex flex-col rounded-3xl border p-7 transition-colors duration-300",
              p.featured ? "border-accent bg-accent text-on-accent" : "glass hover:border-highlight/50",
            )}
          >
            {p.badge && (
              <span className="absolute -top-3 left-7 rounded-full bg-canvas px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-highlight">
                {p.badge}
              </span>
            )}
            <h3 className="font-display-tight text-4xl font-bold">{p.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-6xl leading-none">{p.price}€</span>
              <span className={cn("text-sm", p.featured ? "text-on-accent/70" : "text-muted")}>{p.unit}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className={cn("mt-0.5 size-5 shrink-0", p.featured ? "text-on-accent" : "text-highlight")} />
                  {f}
                </li>
              ))}
            </ul>
            <Button href="#contacto" variant={p.featured ? "dark" : "primary"} className="mt-8 w-full">
              Empezar
            </Button>
          </motion.article>
        ))}
      </motion.div>
      <p className="mt-6 text-xs text-muted">Precios provisionales de demostración.</p>
    </section>
  );
}
