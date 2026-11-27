import { Logo, LogoBadge, Reveal } from "@elena/ui";
import { APP_URL, INSTAGRAM_URL, LOCATION, WHATSAPP_URL, nav } from "@/lib/data";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <LogoBadge className="mb-4 size-28" />
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">Entreno personal, online y nutrición.</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            {LOCATION.name} · {LOCATION.street}
            <br />
            L-V 8:00 a 22:00 · S 10:00 a 13:00
          </p>
        </div>
        <nav aria-label="Pie" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-highlight">
              {l.label}
            </a>
          ))}
          <a href={APP_URL} className="hover:text-highlight">
            Acceso clientes
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Elena"
            className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-highlight hover:text-highlight"
          >
            <InstagramIcon />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-highlight hover:text-highlight"
          >
            WhatsApp
          </a>
        </div>
      </Reveal>
      <p className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} ElenitaFit · Web de demostración, contenido provisional.
      </p>
    </footer>
  );
}
