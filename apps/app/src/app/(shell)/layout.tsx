"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CalendarDays, CirclePlay, ClipboardList, Dumbbell, House, LayoutDashboard, LogOut, TrendingUp, Utensils, Video } from "lucide-react";
import { Logo, cn } from "@elena/ui";
import { DEMO_CLIENT, useApp } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { RestTimer } from "@/components/rest-timer";
import { Toaster } from "@/components/toast";

const clientNav = [
  { href: "/hoy", label: "Hoy", icon: House },
  { href: "/entreno", label: "Entreno", icon: Dumbbell },
  { href: "/comidas", label: "Comidas", icon: Utensils },
  { href: "/citas", label: "Citas", icon: CalendarDays },
  { href: "/videos", label: "Vídeos", icon: CirclePlay },
  { href: "/progreso", label: "Progreso", icon: TrendingUp },
];
const coachNav = [
  { href: "/coach", label: "Panel", icon: LayoutDashboard },
  { href: "/coach/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/coach/plantillas", label: "Plantillas", icon: ClipboardList },
  { href: "/coach/videos", label: "Vídeos", icon: Video },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const role = useApp((s) => s.role);
  const logout = useApp((s) => s.logout);
  const news = useApp((s) => s.appointments.some((a) => a.clientId === DEMO_CLIENT && a.unseen && a.status === "booked"));
  const pathname = usePathname();
  const router = useRouter();

  const isCoachPath = pathname.startsWith("/coach");

  useEffect(() => {
    if (!mounted) return;
    if (!role) router.replace("/");
    else if (role === "coach" && !isCoachPath) router.replace("/coach");
    else if (role === "client" && isCoachPath) router.replace("/hoy");
  }, [mounted, role, isCoachPath, router]);

  const ok = mounted && role && (role === "coach") === isCoachPath;
  if (!ok) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="size-10 animate-spin rounded-full border-2 border-line border-t-highlight" aria-label="Cargando" />
      </div>
    );
  }

  const nav = role === "coach" ? coachNav : clientNav;
  const isActive = (href: string) =>
    href === "/coach" ? pathname === "/coach" || pathname.startsWith("/coach/clientes") : pathname.startsWith(href);

  const who = role === "coach" ? { name: "Elena", sub: "Entrenadora" } : { name: "Lucía", sub: "Plan Pro · Híbrido" };

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-surface p-5 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Principal">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative flex h-12 items-center gap-3 rounded-xl px-4 font-medium transition-colors",
                  active ? "text-on-brand" : "text-muted hover:bg-raised hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="side-pill"
                    className="absolute inset-0 -z-0 rounded-xl bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <n.icon className="relative size-5" />
                <span className="relative">{n.label}</span>
                {news && n.href === "/citas" && <span className="relative ml-auto size-2.5 rounded-full bg-bad" aria-label="Cita nueva" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand font-display text-xl text-on-brand">
            {who.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{who.name}</p>
            <p className="truncate text-xs text-muted">{who.sub}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            aria-label="Cerrar sesión"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Cabecera móvil */}
      <header className="safe-top sticky top-0 z-30 glass-nav border-b border-line lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo className="text-xl" />
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            aria-label="Cerrar sesión"
            className="grid size-10 place-items-center rounded-full border border-line text-muted"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 pb-28 lg:px-10 lg:py-10 lg:pb-12">{children}</main>

      {/* Tab bar móvil */}
      <nav
        aria-label="Principal"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 glass-nav border-t border-line lg:hidden"
      >
        <ul className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${nav.length}, 1fr)` }}>
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                    active ? "text-highlight" : "text-muted",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-line"
                      className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-highlight"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <n.icon className="size-6" />
                  {n.label}
                  {news && n.href === "/citas" && <span className="absolute right-[22%] top-2.5 size-2.5 rounded-full bg-bad" aria-label="Cita nueva" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {role === "client" && <RestTimer />}
      <Toaster />
    </div>
  );
}
