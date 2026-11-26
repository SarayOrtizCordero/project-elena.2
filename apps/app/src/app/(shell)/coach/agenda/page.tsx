"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@elena/ui";
import { dayLabel, kindTone, timeLabel } from "@/components/agenda-bits";
import { useToast } from "@/components/toast";
import { bonus, freeSlots, isPast, kinds, type Appointment, type AppointmentKind } from "@/lib/agenda";
import { clients, weekDays } from "@/lib/data";
import { dayNames } from "@/lib/menu";
import { dayKey, useApp } from "@/lib/store";

const card = "rounded-3xl border border-line bg-surface p-5";
const field = "h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-fg focus:border-highlight focus:outline-none";
const hours = Array.from({ length: 16 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
const nameOf = (id: string) => clients.find((c) => c.id === id)?.name ?? "Cliente";

export default function Page() {
  return (
    <Suspense>
      <Agenda />
    </Suspense>
  );
}

function Agenda() {
  const asked = useSearchParams().get("cliente");
  const appointments = useApp((s) => s.appointments);
  const packs = useApp((s) => s.packs);
  const availability = useApp((s) => s.availability);
  const book = useApp((s) => s.book);
  const cancel = useApp((s) => s.cancelAppointment);
  const giveBack = useApp((s) => s.returnSession);
  const toggleSlot = useApp((s) => s.toggleSlot);
  const toast = useToast((s) => s.show);

  const [date, setDate] = useState(() => dayKey());
  const [client, setClient] = useState(() => (clients.some((c) => c.id === asked) ? asked! : clients[0].id));
  const [kind, setKind] = useState<AppointmentKind>("entreno");
  const [time, setTime] = useState("");
  const [asking, setAsking] = useState<string | null>(null);
  const [schedule, setSchedule] = useState(false);
  const [weekday, setWeekday] = useState(0);

  const now = new Date();
  // De una semana atrás a cuatro semanas adelante
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i - 7);
    return { d, date: dayKey(d) };
  });
  const booked = appointments.filter((a) => a.status === "booked");
  const ofDay = booked.filter((a) => a.start.startsWith(date)).sort((x, y) => x.start.localeCompare(y.start));
  const free = freeSlots(date, availability, appointments, now);
  const balance = bonus(client, appointments, packs, now);

  function assign() {
    if (!time) return;
    const start = `${date}T${time}`;
    if (new Date(start) <= now) return toast("Esa hora ya ha pasado");
    const ok = book({ clientId: client, start, kind, by: "coach" });
    toast(ok ? `Cita puesta a ${nameOf(client).split(" ")[0]}: le saldrá en su app` : "Ya hay una cita a esa hora");
    if (ok) setTime("");
  }

  function row(a: Appointment) {
    const past = isPast(a, now);
    return (
      <li key={a.id} className="rounded-2xl bg-raised p-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl tabular-nums">{timeLabel(a.start)}</span>
          <span className={cn("h-9 w-1.5 shrink-0 rounded-full", kindTone[a.kind])} aria-hidden />
          <span className="min-w-0 flex-1">
            <Link href={`/coach/clientes/${a.clientId}`} className="block truncate font-semibold hover:underline">
              {nameOf(a.clientId)}
            </Link>
            <span className="block text-xs text-muted">
              {kinds[a.kind]}
              {past && (a.returned ? " · sesión devuelta" : " · sesión descontada")}
            </span>
          </span>
          {past ? (
            <button
              type="button"
              onClick={() => giveBack(a.id, !a.returned)}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-highlight"
            >
              <RotateCcw className="size-3.5" aria-hidden /> {a.returned ? "Descontar" : "Devolver"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAsking(asking === a.id ? null : a.id)}
              aria-label={`Anular cita de ${nameOf(a.clientId)}`}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted hover:text-bad"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        {asking === a.id && !past && (
          <div className="mt-3 flex items-center justify-end gap-2 text-sm">
            <span className="mr-auto text-muted">Si la anulas tú, no se descuenta.</span>
            <button
              type="button"
              onClick={() => {
                cancel(a.id, "coach");
                setAsking(null);
                toast("Cita anulada");
              }}
              className="h-10 rounded-full bg-bad px-4 font-bold text-canvas"
            >
              Anular
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Agen<span className="text-highlight">da</span>
        </h1>
        <p className="text-muted">Citas presenciales. La sesión se descuenta sola cuando llega la hora.</p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Día">
        {days.map((x) => {
          const on = x.date === date;
          const count = booked.filter((a) => a.start.startsWith(x.date)).length;
          return (
            <button
              key={x.date}
              type="button"
              ref={x.date === dayKey() ? (el) => el?.scrollIntoView({ inline: "start", block: "nearest" }) : undefined}
              onClick={() => {
                setDate(x.date);
                setTime("");
              }}
              aria-pressed={on}
              aria-label={`${dayLabel(x.date)}, ${count} citas`}
              className={cn("flex h-20 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border", on ? "border-brand bg-brand text-on-brand" : "border-line bg-surface")}
            >
              <span className="text-[10px] font-semibold uppercase">{x.d.toLocaleDateString("es-ES", { weekday: "short" })}</span>
              <span className="font-display text-2xl leading-none">{x.d.getDate()}</span>
              <span className="mt-1 h-4 text-[11px] font-bold">{count > 0 ? `${count} ●` : ""}</span>
            </button>
          );
        })}
      </div>

      <section className={card} aria-label="Citas del día">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">{dayLabel(date)}</h2>
        {ofDay.length ? <ul className="space-y-2">{ofDay.map(row)}</ul> : <p className="text-sm text-muted">Sin citas este día.</p>}
      </section>

      <section className={card} aria-label="Poner cita">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">Poner cita este día</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-muted">
            Cliente
            <select value={client} onChange={(e) => setClient(e.target.value)} className={cn(field, "mt-1")}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-muted">
            Para qué
            <select value={kind} onChange={(e) => setKind(e.target.value as AppointmentKind)} className={cn(field, "mt-1")}>
              {Object.entries(kinds).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-muted">
            Hora
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={cn(field, "mt-1")} />
          </label>
        </div>

        {free.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Huecos libres">
            {free.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                aria-pressed={time === t}
                className={cn("h-10 rounded-full border px-4 text-sm font-semibold tabular-nums", time === t ? "border-brand bg-brand text-on-brand" : "border-line")}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {balance.free <= 0 && (
          <p className="mt-3 text-sm font-semibold text-bad">
            {nameOf(client).split(" ")[0]} no tiene sesiones libres en su bono.{" "}
            <Link href={`/coach/clientes/${client}`} className="underline">
              Añadir bono
            </Link>
          </p>
        )}

        <button
          type="button"
          onClick={assign}
          disabled={!time}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-lg uppercase tracking-wide text-on-accent transition active:scale-[0.97] disabled:opacity-50"
        >
          <Plus className="size-5" aria-hidden /> Poner cita
        </button>
      </section>

      <section className={card} aria-label="Mi horario">
        <button type="button" onClick={() => setSchedule((v) => !v)} aria-expanded={schedule} className="flex w-full items-center justify-between gap-3 text-left">
          <span>
            <span className="font-display-tight block text-3xl font-bold">Mi horario</span>
            <span className="text-sm text-muted">Las horas que tus clientes pueden reservar.</span>
          </span>
          <ChevronDown className={cn("size-6 shrink-0 text-highlight transition-transform", schedule && "rotate-180")} aria-hidden />
        </button>
        {schedule && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Día de la semana">
              {weekDays.map((l, i) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setWeekday(i)}
                  aria-pressed={weekday === i}
                  aria-label={dayNames[i]}
                  className={cn("h-11 rounded-xl border text-sm font-bold", weekday === i ? "border-brand bg-brand text-on-brand" : "border-line")}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="group" aria-label={`Horas del ${dayNames[weekday].toLowerCase()}`}>
              {hours.map((t) => {
                const on = availability[weekday]?.includes(t) ?? false;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleSlot(weekday, t)}
                    aria-pressed={on}
                    className={cn("h-11 rounded-xl border text-sm font-semibold tabular-nums", on ? "border-highlight bg-raised text-highlight" : "border-line text-muted")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
