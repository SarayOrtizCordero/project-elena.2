import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ElenitaFit",
    short_name: "ElenitaFit",
    description: "Entrenos, comidas y progreso en un solo lugar.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Cobalto: la pantalla inicial de la app instalada enlaza con la pantalla de carga
    background_color: "#1b3fc4",
    theme_color: "#f3f7ff",
    lang: "es",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
