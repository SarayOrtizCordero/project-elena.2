import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { MotionProvider } from "@elena/ui";
import { SwRegister } from "@/components/sw-register";
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
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3001");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ElenitaFit · Tu progreso",
  description: "Entrenos, comidas y progreso en un solo lugar.",
  applicationName: "ElenitaFit",
  appleWebApp: { capable: true, title: "ElenitaFit", statusBarStyle: "default" },
  openGraph: {
    title: "ElenitaFit · App",
    description: "Entrenos, comidas y progreso en un solo lugar.",
    type: "website",
    locale: "es_ES",
    siteName: "ElenitaFit",
  },
  twitter: { card: "summary_large_image", title: "ElenitaFit · App", description: "Entrenos, comidas y progreso en un solo lugar." },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f7ff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <SwRegister />
      </body>
    </html>
  );
}
