"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/** Botón "Instalar app": usa el aviso nativo si el navegador lo ofrece; en iPhone explica el gesto manual. */
export function InstallApp() {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone;
    setInstalled(!!standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  if (evt) {
    return (
      <button
        onClick={async () => {
          await evt.prompt();
          await evt.userChoice;
          setEvt(null);
        }}
        className="mt-4 flex h-14 border border-line bg-surface w-full items-center justify-center gap-2 rounded-full font-display text-lg uppercase tracking-wide transition active:scale-[0.98]"
      >
        <Download className="size-5 text-highlight" aria-hidden /> Instalar app
      </button>
    );
  }

  if (ios) {
    return (
      <p className="mt-4 flex items-start border border-line bg-surface gap-3 rounded-2xl p-4 text-sm text-fg/90">
        <Share className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden />
        <span>
          Para instalarla: toca <strong>Compartir</strong> en Safari y elige <strong>«Añadir a pantalla de inicio»</strong>.
        </span>
      </p>
    );
  }

  return null;
}
