"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Apple, Check, ChevronDown, Drumstick, Milk, PartyPopper, RotateCcw, Share2, Wheat } from "lucide-react";
import { cn } from "@elena/ui";
import { shortDate } from "@/lib/hooks";
import { WEEKS, categories, dayNames, menuFor, planForDate, shoppingList, weekMonday, type Category, type ShoppingItem } from "@/lib/menu";
import { dayKey, useApp } from "@/lib/store";
import { useToast } from "./toast";

const icons: Record<Category, typeof Apple> = {
  "Fruta y verdura": Apple,
  "Carne y pescado": Drumstick,
  "Lácteos y huevos": Milk,
  Despensa: Wheat,
};

const tones: Record<Category, string> = {
  "Fruta y verdura": "bg-pop-2",
  "Carne y pescado": "bg-pop-1",
  "Lácteos y huevos": "bg-pop-3",
  Despensa: "bg-pop-4",
};

const allDays = [0, 1, 2, 3, 4, 5, 6];
const letters = ["L", "M", "X", "J", "V", "S", "D"];

export function ShoppingList() {
  const planStart = useApp((s) => s.planStart);
  const bought = useApp((s) => s.bought);
  const setBought = useApp((s) => s.setBought);
  const toast = useToast((s) => s.show);
  const today = planForDate(dayKey(), planStart);

  const [week, setWeek] = useState(today.week);
  const [day, setDay] = useState<number | "all">("all");

  const days = useMemo(() => (day === "all" ? allDays : [day]), [day]);
  const items = useMemo(() => shoppingList(week, days), [week, days]);

  // Las marcas van ligadas a la fecha: al repetirse el menú, la lista vuelve a empezar
  const monday = weekMonday(week, today.week);

  // Se marca por día: en la vista semanal un producto está comprado si lo está en todos sus días
  const keysOf = (item: ShoppingItem) => item.days.map((d) => `${monday}:${d}:${item.id}`);
  const isBought = (item: ShoppingItem) => keysOf(item).every((k) => bought[k]);
  const count = items.filter(isBought).length;
  const complete = items.length > 0 && count === items.length;

  const title = `Semana ${week + 1} · ${day === "all" ? "Toda la semana" : dayNames[day]}`;

  async function share() {
    const text = [
      `Lista de la compra · ${title}`,
      ...categories.flatMap((cat) => {
        const rows = items.filter((i) => i.cat === cat);
        return rows.length ? [`\n${cat}`, ...rows.map((i) => `${isBought(i) ? "✓" : "•"} ${i.name}: ${i.amount}`)] : [];
      }),
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Lista de la compra", text });
      else {
        await navigator.clipboard.writeText(text);
        toast("Lista copiada");
      }
    } catch (e) {
      // Cerrar el menú de compartir no es un error
      if ((e as Error).name !== "AbortError") toast("No se ha podido compartir la lista");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-3xl border border-line bg-surface p-3 sm:p-4">
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Semana">
          {Array.from({ length: WEEKS }, (_, w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeek(w)}
              aria-pressed={week === w}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl border transition-colors",
                week === w ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest">Semana</span>
              <span className="font-display text-2xl leading-none">{w + 1}</span>
              {w === today.week && <span className="sr-only">(actual)</span>}
              <span aria-hidden className={cn("mt-1 size-1 rounded-full", w === today.week ? "bg-current" : "bg-transparent")} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-1" role="group" aria-label="Día">
          <button
            type="button"
            onClick={() => setDay("all")}
            aria-pressed={day === "all"}
            className={cn(
              "h-11 rounded-xl border text-xs font-bold uppercase transition-colors",
              day === "all" ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
            )}
          >
            Todo
          </button>
          {letters.map((l, d) => (
            <button
              key={l}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              aria-label={dayNames[d]}
              className={cn(
                "h-11 rounded-xl border text-sm font-bold transition-colors",
                day === d ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
                day !== d && week === today.week && d === today.day && "!border-highlight !text-highlight",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Resumen de la lista">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display-tight text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-muted" aria-live="polite">
              {count} de {items.length} en el carro · semana del {shortDate(monday)}
            </p>
          </div>
          <button
            type="button"
            onClick={share}
            aria-label="Compartir lista"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-highlight hover:border-highlight active:scale-90"
          >
            <Share2 className="size-5" aria-hidden />
          </button>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-raised">
          <motion.div
            className="h-full rounded-full bg-highlight"
            initial={false}
            animate={{ width: `${items.length ? (count / items.length) * 100 : 0}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>

        {day !== "all" && (
          <details className="group mt-4 rounded-2xl border border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold">
              Qué vas a comer el {dayNames[day].toLowerCase()}
              <ChevronDown className="size-4 shrink-0 text-highlight transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <ul className="divide-y divide-line border-t border-line px-4">
              {menuFor(week, day).map((m) => (
                <li key={m.id} className="py-3 text-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-highlight">{m.name}</p>
                  <p>{m.items.map((i) => i.name).join(", ")}</p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {complete && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-3xl bg-accent p-5 font-semibold text-on-accent"
        >
          <PartyPopper className="size-6 shrink-0" aria-hidden /> ¡Compra completa! Ya tienes todo.
        </motion.p>
      )}

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        {categories.map((cat) => {
          const rows = items.filter((i) => i.cat === cat);
          if (!rows.length) return null;
          const Icon = icons[cat];
          return (
            <section key={cat} className="rounded-3xl border border-line bg-surface p-5" aria-label={cat}>
              <h3 className="mb-2 flex items-center gap-3">
                <span className={cn("grid size-10 place-items-center rounded-xl text-canvas", tones[cat])}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-display-tight flex-1 text-xl font-bold">{cat}</span>
                <span className="text-xs tabular-nums text-muted">
                  {rows.filter(isBought).length}/{rows.length}
                </span>
              </h3>
              <ul className="divide-y divide-line">
                {rows.map((item) => {
                  const on = isBought(item);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setBought(keysOf(item), !on)}
                        aria-pressed={on}
                        className="flex min-h-14 w-full items-center gap-3 py-2 text-left"
                      >
                        <motion.span
                          initial={false}
                          animate={{ scale: on ? [1, 1.25, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors",
                            on ? "border-accent bg-accent text-on-accent" : "border-line",
                          )}
                        >
                          {on && <Check className="size-4" aria-hidden />}
                        </motion.span>
                        <span className={cn("min-w-0 flex-1 font-medium transition-colors", on && "text-muted line-through")}>{item.name}</span>
                        <span className={cn("shrink-0 text-sm font-semibold tabular-nums", on ? "text-muted" : "text-highlight")}>{item.amount}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={() => setBought(items.flatMap(keysOf), false)}
          className="mx-auto flex min-h-11 items-center gap-2 px-4 text-sm font-semibold text-muted hover:text-fg"
        >
          <RotateCcw className="size-4" aria-hidden /> Desmarcar todo
        </button>
      )}
    </div>
  );
}
