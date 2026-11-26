"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarPlus, Plus, Trash2 } from "lucide-react";
import { BonusMeter, dayLabel, timeLabel } from "./agenda-bits";
import { useToast } from "./toast";
import { isPast, kinds } from "@/lib/agenda";
import { shortDate } from "@/lib/hooks";
import { useApp } from "@/lib/store";

/** Bono y citas de una clienta, vistos por Elena. */
export function ClientBonus({ clientId, firstName }: { clientId: string; firstName: string }) {
  const appointments = useApp((s) => s.appointments);
  const packs = useApp((s) => s.packs);
  const addPack = useApp((s) => s.addPack);
  const removePack = useApp((s) => s.removePack);
  const toast = useToast((s) => s.show);
  const [custom, setCustom] = useState("");

  const mine = packs.filter((p) => p.clientId === clientId);
  const upcoming = appointments
    .filter((a) => a.clientId === clientId && a.status === "booked" && !isPast(a))
    .sort((x, y) => x.start.localeCompare(y.start));

  function add(sessions: number) {
    if (!Number.isInteger(sessions) || sessions < 1 || sessions > 100) return toast("Pon un número de sesiones entre 1 y 100");
    addPack(clientId, sessions);
    setCustom("");
    toast(`Bono de ${sessions} sesiones añadido a ${firstName}`);
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-5" aria-label="Bono y citas">
      <BonusMeter clientId={clientId} title="Bono presencial" />

      <p className="mt-5 mb-2 text-sm text-muted">Cuando te pague, añade su bono:</p>
      <div className="flex flex-wrap gap-2">
        {[4, 8, 10].map((n) => (
          <button key={n} type="button" onClick={() => add(n)} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-bold text-on-accent active:scale-95">
            <Plus className="size-4" aria-hidden /> {n} sesiones
          </button>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add(Number(custom));
          }}
        >
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            aria-label="Otro número de sesiones"
            placeholder="Otro"
            className="h-11 w-20 rounded-full border border-line bg-canvas px-4 text-fg focus:border-highlight focus:outline-none"
          />
          <button type="submit" disabled={!custom} className="h-11 rounded-full border border-line px-4 text-sm font-semibold disabled:opacity-40">
            Añadir
          </button>
        </form>
      </div>

      {mine.length > 0 && (
        <ul className="mt-4 divide-y divide-line">
          {mine.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>
                Bono de {p.sessions} sesiones · {shortDate(p.date)}
              </span>
              <button type="button" onClick={() => removePack(p.id)} aria-label={`Quitar bono de ${p.sessions} sesiones`} className="grid size-10 place-items-center rounded-full text-muted hover:text-bad">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-line pt-4">
        {upcoming.length ? (
          <ul className="mb-3 space-y-1 text-sm">
            {upcoming.map((a) => (
              <li key={a.id}>
                <span className="font-semibold">
                  {dayLabel(a.start)} · {timeLabel(a.start)}
                </span>{" "}
                <span className="text-muted">{kinds[a.kind]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-3 text-sm text-muted">Sin citas pendientes.</p>
        )}
        <Link href={`/coach/agenda?cliente=${clientId}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold hover:border-highlight">
          <CalendarPlus className="size-4" aria-hidden /> Ponerle una cita
        </Link>
      </div>
    </section>
  );
}
