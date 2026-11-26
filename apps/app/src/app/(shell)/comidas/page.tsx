"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "@elena/ui";
import { Bar } from "@/components/ring";
import { ShoppingList } from "@/components/shopping-list";
import { foodDb } from "@/lib/data";
import { useTargets, useTotals } from "@/lib/derive";
import { dayNames, planForDate } from "@/lib/menu";
import { dayKey, useApp } from "@/lib/store";
import { useToast } from "@/components/toast";

const views = [
  { id: "hoy", label: "Menú de hoy" },
  { id: "compra", label: "Lista de la compra" },
] as const;

export default function Page() {
  return (
    <Suspense>
      <Comidas />
    </Suspense>
  );
}

function Comidas() {
  const router = useRouter();
  const view = useSearchParams().get("vista") === "compra" ? "compra" : "hoy";
  const date = dayKey();
  const planStart = useApp((s) => s.planStart);
  const plan = planForDate(date, planStart);
  const totals = useTotals();
  const targets = useTargets();
  const eaten = useApp((s) => s.eaten);
  const extra = useApp((s) => s.extra[date]);
  const toggle = useApp((s) => s.toggleEaten);
  const addFood = useApp((s) => s.addFood);
  const removeFood = useApp((s) => s.removeFood);
  const toast = useToast((s) => s.show);
  const resting = useApp((s) => s.rest !== null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const results = useMemo(
    () => foodDb.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Comi<span className="text-highlight">das</span>
        </h1>
        <p className="text-muted">
          {view === "hoy" ? `Semana ${plan.week + 1} · ${dayNames[plan.day]}. Marca lo que comes.` : "Elige semana y día y marca lo que ya tienes."}
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-line bg-surface p-1" role="tablist" aria-label="Nutrición">
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => router.replace(v.id === "hoy" ? "/comidas" : "/comidas?vista=compra", { scroll: false })}
            className={cn("relative h-11 rounded-full text-sm font-semibold transition-colors", view === v.id ? "text-on-brand" : "text-muted")}
          >
            {view === v.id && (
              <motion.span layoutId="food-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            )}
            <span className="relative">{v.label}</span>
          </button>
        ))}
      </div>

      {view === "compra" ? (
        <ShoppingList />
      ) : (
        <>

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Resumen del día">
        <div className="mb-4 flex items-end justify-between">
          <p className="font-display text-5xl leading-none">
            {Math.round(totals.kcal)}
            <span className="text-xl text-muted"> / {targets.kcal} kcal</span>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Bar label="Proteína" value={totals.p} max={targets.p} tone="bg-pop-1" />
          <Bar label="Carbos" value={totals.c} max={targets.c} tone="bg-pop-3" />
          <Bar label="Grasas" value={totals.f} max={targets.f} tone="bg-pop-4" />
        </div>
      </section>

      {plan.meals.map((meal) => {
        const sub = meal.items.reduce((a, it) => a + (eaten[`${date}:${it.id}`] ? it.kcal : 0), 0);
        const all = meal.items.reduce((a, it) => a + it.kcal, 0);
        return (
          <section key={meal.id} className="rounded-3xl border border-line bg-surface p-5" aria-label={meal.name}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display-tight text-3xl font-bold">
                {meal.name} <span className="text-sm font-normal text-muted">{meal.time}</span>
              </h2>
              <p className="text-sm text-muted">
                <span className="font-semibold text-highlight">{sub}</span> / {all} kcal
              </p>
            </div>
            <ul className="divide-y divide-line">
              {meal.items.map((it) => {
                const on = !!eaten[`${date}:${it.id}`];
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => toggle(`${date}:${it.id}`)}
                      aria-pressed={on}
                      className="flex min-h-16 w-full items-center gap-4 py-3 text-left"
                    >
                      <motion.span
                        animate={{ scale: on ? [1, 1.25, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors",
                          on ? "border-accent bg-accent text-on-accent" : "border-line",
                        )}
                      >
                        {on && <Check className="size-5" />}
                      </motion.span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block font-medium transition-colors", on && "text-muted line-through")}>
                          {it.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {it.qty} · P{it.p} C{it.c} G{it.f}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">{it.kcal}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Añadidos por ti">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">Añadidos por ti</h2>
        {!extra?.length ? (
          <p className="text-sm text-muted">Aún no has añadido nada. Usa el botón + para registrar otro alimento.</p>
        ) : (
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {extra.map((f) => (
                <motion.li
                  key={f.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex min-h-14 items-center gap-3 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{f.name}</span>
                      <span className="block text-xs text-muted">{f.qty}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{f.kcal}</span>
                    <button
                      onClick={() => removeFood(date, f.id)}
                      aria-label={`Quitar ${f.name}`}
                      className="grid size-10 place-items-center rounded-full text-muted hover:bg-raised hover:text-bad"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* Botón flotante */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        aria-label="Añadir alimento"
        className={cn(
          "fixed right-5 z-40 grid size-14 place-items-center rounded-full bg-accent text-on-accent shadow-[0_10px_30px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] lg:right-8",
          // Con un descanso en marcha sube para no quedar tapado por el temporizador
          resting ? "bottom-52 lg:bottom-36" : "bottom-24 lg:bottom-8",
        )}
      >
        <Plus className="size-7" />
      </motion.button>

        </>
      )}

      {/* Hoja de añadir alimento */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[55] flex items-end justify-center lg:items-center" role="dialog" aria-modal="true" aria-label="Añadir alimento">
            <motion.div
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="relative flex max-h-[82dvh] w-full max-w-lg flex-col glass-strong rounded-t-[2rem] lg:rounded-[2rem]"
            >
              <div className="flex items-center gap-3 p-5 pb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar alimento…"
                    className="h-12 w-full rounded-2xl border border-line bg-canvas pl-12 pr-4 focus:border-highlight focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="grid size-12 place-items-center rounded-full border border-line"
                >
                  <X className="size-5" />
                </button>
              </div>
              <ul className="overflow-y-auto px-3 pb-6">
                {results.length === 0 && <li className="px-3 py-8 text-center text-muted">Sin resultados.</li>}
                {results.map((f) => (
                  <li key={f.name}>
                    <button
                      onClick={() => {
                        addFood(date, f);
                        toast(`${f.name} añadido (+${f.kcal} kcal)`);
                        setOpen(false);
                        setQ("");
                      }}
                      className="flex min-h-16 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-raised"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{f.name}</span>
                        <span className="block text-xs text-muted">
                          {f.qty} · P{f.p} C{f.c} G{f.f}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-highlight">{f.kcal} kcal</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
