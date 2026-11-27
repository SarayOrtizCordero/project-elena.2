"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Clock, Copy, MapPin, Send } from "lucide-react";
import { Button, Reveal, RevealText, cn } from "@elena/ui";
import { LOCATION, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/data";
import { buildMessage, levels, nutritionGoals, places, services, trainingGoals, type ServiceId } from "@/lib/intake";

const field =
  "h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-base text-fg placeholder:text-muted/70 transition-colors focus:border-highlight focus:outline-none";
const area = cn(field, "h-auto min-h-24 resize-y py-3");

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-2 block text-sm">
      <span className="font-semibold text-fg">{children}</span>
      {hint && <span className="block text-muted">{hint}</span>}
    </span>
  );
}

/** Selección única en botones grandes, fáciles de tocar en el móvil. */
function Choice({ name, legend, options, hint }: { name: string; legend: string; options: readonly string[]; hint?: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm">
        <span className="font-semibold text-fg">{legend}</span>
        {hint && <span className="block text-muted">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o} className="relative">
            <input type="radio" name={name} value={o} required={i === 0} className="peer absolute inset-0 size-full cursor-pointer opacity-0" />
            <span className="inline-flex min-h-11 items-center rounded-full border border-line bg-canvas px-4 text-sm text-fg transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-checked:shadow-[0_0_0_3px_var(--color-accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-highlight">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Título de bloque con marca amarilla. */
function Title({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3">
      <span aria-hidden className="h-6 w-1.5 shrink-0 rounded-full bg-accent" />
      {children}
    </span>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-5">
        <legend className="float-left w-full font-display-tight text-2xl font-bold"><Title>{title}</Title></legend>
        <div className="clear-both space-y-5">{children}</div>
      </div>
    </motion.fieldset>
  );
}

export function Contact() {
  const [service, setService] = useState<ServiceId | null>(null);
  const [sent, setSent] = useState<{ url: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const svc = services.find((s) => s.id === service);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service) return;
    const text = buildMessage(new FormData(e.currentTarget), service);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    // Se abre en el mismo gesto del clic para que el navegador no lo bloquee.
    window.open(url, "_blank", "noopener");
    setSent({ url, text });
  }

  async function copy() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.text);
      setCopied(true);
    } catch {
      /* sin portapapeles: queda el botón de WhatsApp */
    }
  }

  return (
    <section id="contacto" data-tone="brand" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 size-[34rem] rounded-full bg-alt/25 blur-[140px]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
              <span className="h-px w-8 bg-highlight" /> Empieza hoy
            </p>
            <RevealText as="h2" text="Tu primer paso, *ahora*" className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
            <p className="mt-6 max-w-md text-lg text-muted">
              Rellena este cuestionario y le llega a Elena por WhatsApp con todo lo que necesita para preparar tu propuesta.
              Tarda unos 5 minutos.
            </p>
            <div className="mt-8">
              <Button href={WHATSAPP_URL} variant="dark" size="lg">
                Prefiero escribir por WhatsApp
              </Button>
            </div>
            <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden />
                <span>
                  <strong className="block text-base">{LOCATION.name}</strong>
                  <a href={LOCATION.mapUrl} target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:underline">
                    {LOCATION.street}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden />
                <span>
                  <strong className="block text-base">Horario</strong>
                  {LOCATION.hours.map((h) => (
                    <span key={h} className="block text-muted">{h}</span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div data-tone="paper" className="rounded-3xl p-6 shadow-2xl shadow-black/20 sm:p-8">
            {sent ? (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
                <CheckCircle2 className="size-16 text-highlight" aria-hidden />
                <h3 className="font-display-tight text-4xl font-bold">Último paso: envíalo</h3>
                <p className="max-w-sm text-muted">
                  Se ha abierto WhatsApp con tus respuestas ya escritas. Pulsa <strong>enviar</strong> para que lleguen a Elena.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href={sent.url} size="lg">
                    Abrir WhatsApp <Send className="size-5" />
                  </Button>
                  <Button type="button" variant="dark" size="lg" onClick={copy}>
                    {copied ? "Copiado" : (<>Copiar mensaje <Copy className="size-5" /></>)}
                  </Button>
                </div>
                <p className="text-xs text-muted">Si no se abre, pulsa «Abrir WhatsApp» o copia el mensaje y pégalo en el chat.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <fieldset className="space-y-4">
                  <legend className="mb-3 font-display-tight text-2xl font-bold"><Title>1 · Tus datos</Title></legend>
                  <label className="block">
                    <Label>Nombre y apellidos</Label>
                    <input required name="name" autoComplete="name" className={field} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <Label>Correo electrónico</Label>
                      <input required type="email" name="email" autoComplete="email" placeholder="tu@email.com" className={field} />
                    </label>
                    <label className="block">
                      <Label>Teléfono / WhatsApp</Label>
                      <input required type="tel" name="phone" autoComplete="tel" inputMode="tel" className={field} />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <Label>Edad</Label>
                      <input required type="number" name="age" inputMode="numeric" min={14} max={99} placeholder="años" className={field} />
                    </label>
                    <label className="block">
                      <Label>Altura</Label>
                      <input required type="number" name="height" inputMode="numeric" min={120} max={230} placeholder="cm" className={field} />
                    </label>
                    <label className="block">
                      <Label>Peso actual</Label>
                      <input required type="number" name="weight" inputMode="decimal" step="0.1" min={30} max={250} placeholder="kg" className={field} />
                    </label>
                  </div>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-fg">¿Qué servicio has elegido o te interesa?</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map((s) => (
                        <label key={s.id} className="relative">
                          <input
                            type="radio"
                            name="service"
                            value={s.id}
                            required
                            checked={service === s.id}
                            onChange={() => setService(s.id)}
                            className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                          />
                          <span className="flex min-h-14 items-center rounded-2xl border border-line bg-canvas px-4 text-sm font-semibold text-fg transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-checked:shadow-[0_0_0_3px_var(--color-accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-highlight">
                            {s.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </fieldset>

                <AnimatePresence initial={false}>
                  {svc?.training && (
                    <Block key="training" title="2 · Tu entrenamiento">
                      <Choice name="t_goal" legend="Objetivo principal" options={trainingGoals} />
                      <Choice name="t_level" legend="Experiencia previa y nivel" options={levels} />
                      <label className="block">
                        <Label hint="¿Has entrenado con pesas o hecho deporte pautado antes?">Cuéntame tu experiencia</Label>
                        <textarea name="t_exp" rows={2} maxLength={200} className={area} />
                      </label>
                      <Choice name="t_place" legend="Lugar y material disponible" options={places} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <Label>Días a la semana que puedes entrenar</Label>
                          <select required name="t_days" defaultValue="" className={field}>
                            <option value="" disabled>Elige</option>
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n}>{n}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <Label>Tiempo por sesión</Label>
                          <select required name="t_minutes" defaultValue="" className={field}>
                            <option value="" disabled>Elige</option>
                            {[30, 45, 60, 75, 90].map((n) => <option key={n} value={n}>{n} min</option>)}
                          </select>
                        </label>
                      </div>
                      <label className="block">
                        <Label hint="Historial articular, dolores actuales o pruebas médicas relevantes. Si no tienes, escribe «ninguna».">
                          Lesiones, molestias o limitaciones físicas
                        </Label>
                        <textarea required name="t_injuries" rows={3} maxLength={400} className={area} />
                      </label>
                      <label className="block">
                        <Label hint="¿Compites o practicas otro deporte (fútbol, pádel, running…)? ¿Qué días y a qué hora? Si no, escribe «no».">
                          Práctica deportiva actual
                        </Label>
                        <textarea required name="t_sport" rows={2} maxLength={300} className={area} />
                      </label>
                    </Block>
                  )}

                  {svc?.nutrition && (
                    <Block key="nutrition" title={svc.training ? "3 · Tu nutrición" : "2 · Tu nutrición"}>
                      <Choice name="n_goal" legend="Objetivo nutricional" options={nutritionGoals} />
                      <label className="block">
                        <Label hint="Hora a la que te levantas, trabajas o estudias, entrenas y te acuestas. ¿Comes fuera de casa o llevas tupper?">
                          Horarios y rutina diaria
                        </Label>
                        <textarea required name="n_routine" rows={3} maxLength={400} className={area} />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <Label>Comidas que prefieres al día</Label>
                          <select required name="n_meals" defaultValue="" className={field}>
                            <option value="" disabled>Elige</option>
                            {[2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <Label>¿Cuándo tienes más hambre?</Label>
                          <input required name="n_hunger" maxLength={200} placeholder="Ej. por la tarde, de noche…" className={field} />
                        </label>
                      </div>
                      <label className="block">
                        <Label hint="Lo que no puedes o no quieres comer bajo ningún concepto. Si no hay, escribe «ninguno».">
                          Alergias, intolerancias o alimentos prohibidos
                        </Label>
                        <textarea required name="n_allergies" rows={2} maxLength={400} className={area} />
                      </label>
                      <label className="block">
                        <Label hint="Alimentos que te encantan, lo que siempre hay en tu nevera y cuánto tiempo o nivel tienes para cocinar.">
                          Gustos y preferencias
                        </Label>
                        <textarea required name="n_tastes" rows={3} maxLength={400} className={area} />
                      </label>
                      <label className="block">
                        <Label hint="¿Has hecho dietas antes? ¿Cómo es tu tránsito intestinal? ¿Notas hinchazón o pesadez con algún alimento?">
                          Historial y digestión
                        </Label>
                        <textarea required name="n_history" rows={3} maxLength={400} className={area} />
                      </label>
                    </Block>
                  )}
                </AnimatePresence>

                <fieldset className="space-y-4">
                  <legend className="mb-3 font-display-tight text-2xl font-bold">
                    <Title>{svc ? (svc.training && svc.nutrition ? "4" : "3") : "2"} · Para terminar</Title>
                  </legend>
                  <label className="block">
                    <Label>¿Hay algo más que deba saber antes de empezar?</Label>
                    <textarea name="extra" rows={3} maxLength={500} className={area} />
                  </label>
                  <label className="flex items-start gap-3 text-sm text-muted">
                    <input required type="checkbox" name="privacy" className="mt-1 size-5 shrink-0 accent-highlight" />
                    <span>
                      He leído la política de privacidad y acepto que se traten mis datos, incluidos los de salud y hábitos
                      que indico, para preparar mi plan.
                    </span>
                  </label>
                </fieldset>

                <Button type="submit" size="lg" className="w-full">
                  Enviar por WhatsApp <Send className="size-5" />
                </Button>
                <p className="text-center text-xs text-muted">Se abrirá WhatsApp con tus respuestas; solo tendrás que pulsar enviar.</p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
