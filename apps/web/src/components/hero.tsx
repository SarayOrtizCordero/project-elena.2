"use client";

import { motion } from "motion/react";
import { ArrowRight, Flame, TrendingDown } from "lucide-react";
import { Button, LogoBadge, Placeholder, RevealText } from "@elena/ui";
import { stats } from "@/lib/data";
import { CountUp } from "./count-up";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Los botones sobre la imagen aparecen una vez y se quedan quietos. */
const pop = (delay: number) => ({
  initial: { opacity: 0, scale: 0.7, y: 12 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 260, damping: 20, delay },
});

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[38rem] rounded-full bg-volt/10 blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-volt"
          >
            <span className="size-2 rounded-full bg-volt" /> Presencial · Online
          </motion.p>

          <RevealText
            as="h1"
            text={"Entrena\ncon *plan*,\nno con suerte"}
            delay={0.25}
            stagger={0.08}
            className="font-display-tight text-[clamp(3.5rem,13vw,8.5rem)] font-extrabold"
          />

          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-mute sm:text-xl">
            Rutina, nutrición y seguimiento real, diseñados para ti por Elena. En el gym o desde tu casa, con una app
            que te lo pone fácil.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contacto" size="lg">
              Quiero mi plan <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="#planes" variant="ghost" size="lg">
              Ver planes
            </Button>
          </motion.div>

          <motion.dl variants={item} className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl text-volt sm:text-5xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <p className="mt-1 text-xs text-mute sm:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="overflow-hidden rounded-3xl border border-line">
            <Placeholder label="Foto de Elena (demo)" ratio="4/5" />
          </div>

          <motion.div
            {...pop(0.9)}
            className="absolute -right-2 -top-6 rounded-full bg-ink/90 p-1.5 shadow-xl backdrop-blur sm:-right-6 sm:-top-8"
          >
            <LogoBadge className="size-24 sm:size-28" />
          </motion.div>

          <motion.div
            {...pop(0.6)}
            className="absolute -left-3 top-10 rounded-2xl border border-line bg-ink/90 p-3.5 shadow-xl backdrop-blur sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-volt text-ink">
                <TrendingDown className="size-5" />
              </span>
              <div>
                <p className="font-display text-2xl leading-none">-6,4 kg</p>
                <p className="text-xs text-mute">en 8 semanas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...pop(0.75)}
            className="absolute -right-2 bottom-12 rounded-2xl border border-line bg-ink/90 p-3.5 shadow-xl backdrop-blur sm:-right-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-ink-3 text-volt">
                <Flame className="size-5" />
              </span>
              <div>
                <p className="font-display text-2xl leading-none">21 días</p>
                <p className="text-xs text-mute">racha entrenando</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
