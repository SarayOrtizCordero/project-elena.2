import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { MotionProvider } from "@elena/ui";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--nf-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--nf-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ElenitaFit · Entrenamiento personal presencial y online",
  description:
    "Entrenamiento personal y nutrición a tu medida, en persona o desde donde estés. Rutinas, plan de comidas y seguimiento real con Elena.",
  twitter: { card: "summary_large_image", title: "ElenitaFit · Web", description: "Rutinas, nutrición y seguimiento real. Presencial u online." },
  openGraph: {
    siteName: "ElenitaFit",
    title: "ElenitaFit · Web",
    description: "Rutinas, nutrición y seguimiento real. Presencial u online.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f7ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Si en 3 s la página no ha arrancado (navegador antiguo o error), se muestra el contenido sin animaciones. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "setTimeout(function(){if(!window.__elenaReady){document.documentElement.className+=' no-js-fallback'}},3000)",
          }}
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
