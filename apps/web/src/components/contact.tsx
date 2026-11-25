"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { Button, Reveal, RevealText } from "@elena/ui";
import { WHATSAPP_URL } from "@/lib/data";

const field =
  "h-14 w-full rounded-2xl border border-line bg-ink px-4 text-base text-bone placeholder:text-mute/70 transition-colors focus:border-volt focus:outline-none";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // DEMO: aquí irá la llamada real (Supabase / email). Simulamos latencia.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  }

  return (
    <section id="contacto" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 size-[34rem] rounded-full bg-volt/10 blur-[140px]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-volt">
            <span className="h-px w-8 bg-volt" /> Empieza hoy
          </p>
          <RevealText as="h2" text="Tu primer paso, *ahora*" className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
          <p className="mt-6 max-w-md text-lg text-mute">
            Cuéntame tu objetivo y te respondo en menos de 24 horas con una propuesta a tu medida.
          </p>
          <div className="mt-8">
            <Button href={WHATSAPP_URL} variant="dark" size="lg">
              Prefiero WhatsApp
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-80 flex-col items-center justify-center gap-4 text-center"
                >
                  <CheckCircle2 className="size-16 text-volt" />
                  <h3 className="font-display-tight text-4xl font-bold">¡Recibido!</h3>
                  <p className="text-mute">Te contactaré muy pronto. (Formulario de demostración, no se envía nada.)</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm text-mute">Nombre</span>
                    <input required name="name" autoComplete="name" placeholder="Tu nombre" className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-mute">Email</span>
                    <input required type="email" name="email" autoComplete="email" placeholder="tu@email.com" className={field} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-mute">Modalidad</span>
                      <select name="mode" className={field} defaultValue="online">
                        <option value="online">Online</option>
                        <option value="presencial">Presencial</option>
                        <option value="hibrido">Híbrido</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm text-mute">Objetivo</span>
                      <select name="goal" className={field} defaultValue="grasa">
                        <option value="grasa">Perder grasa</option>
                        <option value="musculo">Ganar músculo</option>
                        <option value="salud">Mejorar mi salud</option>
                      </select>
                    </label>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-mute">
                    <input required type="checkbox" className="mt-1 size-4 accent-[#facc15]" />
                    Acepto que se traten mis datos para contactarme (política de privacidad).
                  </label>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Enviando…" : (<>Enviar <Send className="size-5" /></>)}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
