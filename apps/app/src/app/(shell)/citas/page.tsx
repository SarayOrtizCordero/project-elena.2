"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BellRing, Lock } from "lucide-react";
import { cn } from "@elena/ui";
import { BonusMeter, CalendarButton, dayLabel, kindTone, timeLabel, useBonus } from "@/components/agenda-bits";
import { useToast } from "@/components/toast";
import { CANCEL_HOURS, GYM, canCancel, freeSlots, isPast, kinds, type AppointmentKind } from "@/lib/agenda";
import { DEMO_CLIENT, dayKey, useApp } from "@/lib/store";

const card = "rounded-3xl border border-line bg-surface p-5";

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function Citas() {
  const appointments = useApp((s) => s.appointments);
  const availability = useApp((s) => s.availability);
  const book = useApp((s) => s.book);
  const cancel = useApp((s) => s.cancelAppointment);
  const markSeen = useApp((s) => s.markSeen);
  const toast = useToast((s) => s.show);
  const b = useBonus(DEMO_CLIENT);

  const [kind, setKind] = useState<AppointmentKind>("entreno");
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [asking, setAsking] = useState<string | null>(null);

  const now = new Date();
  const mine = appointments.filter((a) => a.clientId === DEMO_CLIENT).sort((x, y) => x.start.localeCompare(y.start));
  const upcoming = mine.filter((a) => a.status === "booked" && !isPast(a, now));
  const history = mine.filter((a) => isPast(a, now) || a.status === "cancelled").reverse();
  const unseen = upcoming.filter((a) => a.unseen);

  const days = nextDays(14).map((d) => ({ date: dayKey(d), d, slots: freeSlots(dayKey(d), availability, appointments, now) }));
  const selected = days.find((x) => x.date === day && x.slots.length) ?? days.find((x) => x.slots.length);
  const chosen = selected && time && selected.slots.includes(time) ? `${selected.date}T${time}` : null;
  const lastMinute = chosen !== null && new Date(chosen).getTime() - now.getTime() < CANCEL_HOURS * 3_600_000;

  function reserve() {
    if (!chosen) return;
    const ok = book({ clientId: DEMO_CLIENT, start: chosen, kind, by: "client" });
    toast(ok ? "Cita reservada" : "Ese hueco ya no está disponible");
    setTime(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Mis <span className="text-highlight">citas</span>
        </h1>
        <p className="text-muted">Sesiones presenciales con Elena en {GYM.name}, {GYM.address}.</p>
        <p className="text-sm text-muted">Horario del gimnasio: {GYM.schedule}</p>
      </div>

      {unseen.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap items-center gap-3 rounded-3xl bg-alt p-5 text-on-alt">
          <BellRing className="size-6 shrink-0" aria-hidden />
          <p className="min-w-0 flex-1 font-semibold">
            Elena te ha puesto {unseen.length === 1 ? "una cita nueva" : `${unseen.length} citas nuevas`}
          </p>
          <button type="button" onClick={() => markSeen(DEMO_CLIENT)} className="h-10 rounded-full bg-on-alt px-5 text-sm font-bold text-alt">
            Entendido
          </button>
        </motion.div>
      )}

      <section className={card} aria-label="Tu bono">
        <BonusMeter clientId={DEMO_CLIENT} title="Tu bono presencial" />
      </section>

      <section className={card} aria-label="Próximas citas">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">Próximas</h2>
        {!upcoming.length && <p className="text-sm text-muted">No tienes citas. Reserva la siguiente abajo.</p>}
        <ul className="space-y-3">
          {upcoming.map((a) => (
            <li key={a.id} className="rounded-2xl bg-raised p-4">
              <div className="flex items-start gap-3">
                <span className={cn("mt-1.5 size-3 shrink-0 rounded-full", kindTone[a.kind])} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {dayLabel(a.start)} · {timeLabel(a.start)}
                  </p>
                  <p className="text-sm text-muted">{kinds[a.kind]}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CalendarButton appointment={a} />
                {!canCancel(a, now) ? (
                  <p className="flex items-start gap-2 text-sm text-muted">
                    <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                    Quedan menos de {CANCEL_HOURS} h: ya no se puede cancelar y la sesión contará.
                  </p>
                ) : asking === a.id ? (
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        cancel(a.id, "client");
                        setAsking(null);
                        toast("Cita cancelada. No se descuenta la sesión");
                      }}
                      className="h-10 rounded-full bg-bad px-4 text-sm font-bold text-canvas"
                    >
                      Sí, cancelar
                    </button>
                    <button type="button" onClick={() => setAsking(null)} className="h-10 px-3 text-sm font-semibold text-muted">
                      No
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setAsking(a.id)} className="min-h-10 px-3 text-sm font-semibold text-muted underline underline-offset-4 hover:text-fg">
                    Cancelar cita
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={card} aria-label="Reservar cita">
        <h2 className="font-display-tight text-3xl font-bold">Reservar cita</h2>
        <p className="mb-4 text-sm text-muted">Puedes cancelar hasta {CANCEL_HOURS} h antes. Después la sesión cuenta como hecha.</p>

        {b.free <= 0 ? (
          <p className="rounded-2xl bg-raised p-4 text-sm">
            {b.bought === 0 ? "Todavía no tienes un bono." : "Has reservado todas las sesiones de tu bono."} Habla con Elena para renovarlo.
          </p>
        ) : !selected ? (
          <p className="text-sm text-muted">No quedan huecos en las próximas dos semanas.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="¿Para qué es?">
              {(Object.keys(kinds) as AppointmentKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={cn("flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold", kind === k ? "border-highlight bg-raised" : "border-line text-muted")}
                >
                  <span className={cn("size-2.5 rounded-full", kindTone[k])} aria-hidden />
                  {kinds[k]}
                </button>
              ))}
            </div>

            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Día">
              {days.map((x) => {
                const on = x.date === selected.date;
                return (
                  <button
                    key={x.date}
                    type="button"
                    disabled={!x.slots.length}
                    onClick={() => {
                      setDay(x.date);
                      setTime(null);
                    }}
                    aria-pressed={on}
                    aria-label={dayLabel(x.date)}
                    className={cn("flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border disabled:opacity-35", on ? "border-brand bg-brand text-on-brand" : "border-line")}
                  >
                    <span className="text-[10px] font-semibold uppercase">{x.d.toLocaleDateString("es-ES", { weekday: "short" })}</span>
                    <span className="font-display text-2xl leading-none">{x.d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Hora">
              {selected.slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={cn("h-12 rounded-2xl border font-display text-xl tabular-nums", time === t ? "border-brand bg-brand text-on-brand" : "border-line")}
                >
                  {t}
                </button>
              ))}
            </div>

            {lastMinute && <p className="text-sm font-semibold text-bad">Es en menos de {CANCEL_HOURS} h: no podrás cancelarla.</p>}

            <button
              type="button"
              onClick={reserve}
              disabled={!chosen}
              className="h-14 w-full rounded-full bg-accent font-display text-lg uppercase tracking-wide text-on-accent transition active:scale-[0.97] disabled:opacity-50"
            >
              {chosen ? `Reservar ${dayLabel(chosen).split(",")[0].toLowerCase()} a las ${time}` : "Elige una hora"}
            </button>
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className={card} aria-label="Historial">
          <h2 className="font-display-tight mb-2 text-3xl font-bold">Historial</h2>
          <ul className="divide-y divide-line">
            {history.slice(0, 8).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  {dayLabel(a.start)} · {timeLabel(a.start)}
                </span>
                <span className="shrink-0 font-semibold text-muted">
                  {a.status === "cancelled" ? "Cancelada" : a.returned ? "Sesión devuelta" : "Realizada"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
