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

export const metadata: Metadata = {
  title: "Elena Fit · Entrenamiento personal presencial y online",
  description:
    "Entrenamiento personal y nutrición a tu medida, en persona o desde donde estés. Rutinas, plan de comidas y seguimiento real con Elena.",
  openGraph: {
    title: "Elena Fit · Entrenamiento personal presencial y online",
    description: "Rutinas, nutrición y seguimiento real. Presencial u online.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
