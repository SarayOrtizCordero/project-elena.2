"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, ClipboardList, Dumbbell } from "lucide-react";
import { LogoBadge } from "@elena/ui";
import { useApp, type Role } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { InstallApp } from "@/components/install-app";

const WEB_URL =
  process.env.NEXT_PUBLIC_WEB_URL ??
  (process.env.NODE_ENV === "production" ? "https://project-elena-2.vercel.app" : "http://localhost:3000");

export default function Login() {
  const mounted = useMounted();
  const role = useApp((s) => s.role);
  const login = useApp((s) => s.login);
  const router = useRouter();

  useEffect(() => {
    if (mounted && role) router.replace(role === "coach" ? "/coach" : "/hoy");
  }, [mounted, role, router]);

  function enter(r: Role) {
    login(r);
    router.push(r === "coach" ? "/coach" : "/hoy");
  }

  const options = [
    { r: "client" as const, icon: Dumbbell, title: "Soy cliente", text: "Entrena, registra tus comidas y mira tu progreso." },
    { r: "coach" as const, icon: ClipboardList, title: "Soy Elena", text: "Gestiona clientes, planes y seguimiento." },
  ];

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-10">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-highlight/10 blur-[140px]" />
      <div className="relative w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <LogoBadge className="size-28" />
          <h1 className="font-display-tight mt-10 text-6xl font-extrabold sm:text-7xl">
            Tu progreso,
            <br />
            <span className="text-highlight">a tu ritmo</span>
          </h1>
          <p className="mt-4 text-muted">Entrenos, comidas y evolución en un solo lugar.</p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {options.map((o, i) => (
            <motion.button
              key={o.r}
              onClick={() => enter(o.r)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left transition-colors hover:border-highlight"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-on-brand">
                <o.icon className="size-7" />
              </span>
              <span className="flex-1">
                <span className="block font-display-tight text-3xl font-bold">{o.title}</span>
                <span className="block text-sm text-muted">{o.text}</span>
              </span>
              <ArrowRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-highlight" />
            </motion.button>
          ))}
        </div>

        <InstallApp />

        <p className="mt-6 text-center text-xs text-muted">
          Demo: acceso sin contraseña y datos provisionales. ·{" "}
          <a href={WEB_URL} className="underline underline-offset-2 hover:text-highlight">
            Volver a la web
          </a>
        </p>
      </div>
    </div>
  );
}
