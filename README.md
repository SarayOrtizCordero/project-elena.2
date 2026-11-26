# Elena Fit

Monorepo (npm workspaces + Turborepo) con la landing y la app de seguimiento de Elena.
**Estado: DEMO** — textos, precios e imágenes son provisionales; la app guarda los datos en el propio dispositivo.

```
apps/
  web/   Landing (Next.js, Tailwind v4, Motion)        → http://localhost:3000
  app/   App PWA para clientes y coach (datos demo)     → http://localhost:3001
packages/
  ui/    Sistema de diseño compartido (tokens negro/amarillo, Button, Reveal, Placeholder, Logo)
supabase/
  migrations/  Esquema + RLS para cuando se pase a producción
```

## Arrancar

```powershell
npm install
npm run dev          # web y app a la vez
npm run dev:web      # solo landing
npm run dev:app      # solo app
npm run build        # compila todo
npm run typecheck
```

## Demo de la app

La pantalla de entrada tiene dos accesos sin contraseña: **cliente** (Lucía) y **coach** (Elena).
Todo lo que registres (series, comidas, peso) se guarda en `localStorage`. Es instalable como PWA
(en producción: `npm run build && npm run start`).

## Variables de entorno (opcionales)

| Variable | Dónde | En desarrollo | En producción |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | web | `http://localhost:3001` | `https://project-elena-2-app.vercel.app` |
| `NEXT_PUBLIC_WEB_URL` | app | `http://localhost:3000` | `https://project-elena-2.vercel.app` |

Si cambia el dominio o el alojamiento, define estas variables y vuelve a desplegar.

## Del demo a producción

1. Crear proyecto Supabase y aplicar `supabase/migrations/0001_init.sql`.
2. Sustituir `apps/app/src/lib/store.ts` (zustand local) por consultas a Supabase + Auth.
3. Sustituir contenido provisional (`apps/web/src/lib/data.ts`, `Placeholder`) por el real de Elena.
4. Conectar el formulario de contacto (`apps/web/src/components/contact.tsx`) a email o base de datos.
5. Añadir Stripe si se cobran los planes online.
