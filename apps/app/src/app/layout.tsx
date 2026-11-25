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

export const metadata: Metadata = {
  title: "Elena Fit · Tu progreso",
  description: "Entrenos, comidas y progreso en un solo lugar.",
  applicationName: "Elena Fit",
  appleWebApp: { capable: true, title: "Elena Fit", statusBarStyle: "black-translucent" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
