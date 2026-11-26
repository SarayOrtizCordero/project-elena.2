import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "ElenitaFit · Tu progreso, a tu ritmo (app)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen al compartir la APP: amarillo y cobalto, para distinguirla de la web (negra). */
export default function OpengraphImage() {
  const badge = readFileSync(join(process.cwd(), "public", "brand", "logo-badge.png"));
  const src = `data:image/png;base64,${badge.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffe135", color: "#0a1f66", padding: "56px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 700 }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", background: "#1b3fc4", color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: 5, padding: "10px 26px", borderRadius: 999 }}>APP ELENITAFIT</div>
          </div>
          <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1, display: "flex", flexDirection: "column" }}>
            <span>TU PROGRESO,</span>
            <span>A TU RITMO</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, display: "flex" }}>Entrenos, comidas, citas y progreso</div>
        </div>
        <div style={{ display: "flex", width: 360, height: 360, borderRadius: 72, background: "#1b3fc4", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={310} height={310} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
