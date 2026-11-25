"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button, Reveal, RevealText, cn } from "@elena/ui";
import { plans } from "@/lib/data";

const tabs = [
  { id: "online", label: "Online" },
  { id: "presencial", label: "Presencial" },
] as const;

export function Plans() {
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("online");

  return (
    <section id="planes" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-volt">
              <span className="h-px w-8 bg-volt" /> Planes
            </p>
            <RevealText as="h2" text="Elige tu *ritmo*" className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
          </div>

          <div role="tablist" aria-label="Modalidad" className="relative flex rounded-full border border-line bg-ink-2 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={mode === t.id}
                onClick={() => setMode(t.id)}
                className={cn(
                  "relative z-10 h-11 rounded-full px-6 font-display text-lg uppercase tracking-wide transition-colors",
                  mode === t.id ? "text-ink" : "text-mute hover:text-bone",
                )}
              >
                {mode === t.id && (
                  <motion.span
                    layoutId="plan-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-volt"
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
              p.featured ? "border-volt bg-volt text-ink" : "glass hover:border-volt/50",
            )}
          >
            {p.badge && (
              <span className="absolute -top-3 left-7 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-volt">
                {p.badge}
              </span>
            )}
            <h3 className="font-display-tight text-4xl font-bold">{p.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-6xl leading-none">{p.price}€</span>
              <span className={cn("text-sm", p.featured ? "text-ink/70" : "text-mute")}>{p.unit}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className={cn("mt-0.5 size-5 shrink-0", p.featured ? "text-ink" : "text-volt")} />
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
      <p className="mt-6 text-xs text-mute">Precios provisionales de demostración.</p>
    </section>
  );
}
