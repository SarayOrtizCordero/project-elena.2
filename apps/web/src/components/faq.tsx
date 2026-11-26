"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal, RevealText } from "@elena/ui";
import { faqs } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
            <span className="h-px w-8 bg-highlight" /> Dudas
          </p>
          <RevealText as="h2" text="Preguntas *frecuentes*" className="font-display-tight text-5xl font-extrabold sm:text-6xl" />
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-line border-y border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.li
                  key={f.q}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium"
                  >
                    {f.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-highlight"
                    >
                      <Plus className="size-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-12 text-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
