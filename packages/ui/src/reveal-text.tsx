"use client";

import { motion } from "motion/react";
import { cn } from "./cn";

type Piece = { t: string; a: boolean };
type Word = Piece[] | "br";

/** "Hola *mundo*\nlinea 2" → palabras; lo que va entre * * se resalta; \n = salto de línea. */
function parse(text: string): Word[] {
  const words: Word[] = [];
  let cur: Piece[] = [];
  let buf = "";
  let accent = false;
  const flushBuf = () => {
    if (buf) {
      cur.push({ t: buf, a: accent });
      buf = "";
    }
  };
  const flushWord = () => {
    flushBuf();
    if (cur.length) {
      words.push(cur);
      cur = [];
    }
  };
  for (const ch of text) {
    if (ch === "*") {
      flushBuf();
      accent = !accent;
    } else if (ch === "\n") {
      flushWord();
      words.push("br");
    } else if (/\s/.test(ch)) {
      flushWord();
    } else buf += ch;
  }
  flushWord();
  return words;
}

const word = {
  hidden: { y: "108%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  accentClassName?: string;
  delay?: number;
  stagger?: number;
};

/** Texto que aparece palabra a palabra, subiendo desde una máscara, al hacer scroll. */
export function RevealText({
  text,
  as = "h2",
  className,
  accentClassName = "text-highlight",
  delay = 0,
  stagger = 0.06,
}: Props) {
  const Comp = motion[as] as typeof motion.h2;
  const words = parse(text);
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) =>
        w === "br" ? (
          <br key={i} />
        ) : (
          <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] pt-[0.04em] align-bottom -mb-[0.1em]">
            <motion.span variants={word} className="inline-block">
              {w.map((p, k) =>
                p.a ? (
                  <span key={k} className={cn(accentClassName)}>
                    {p.t}
                  </span>
                ) : (
                  p.t
                ),
              )}
            </motion.span>
          </span>
        ),
      )}
    </Comp>
  );
}
