import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "ElenitaFit · Entrena con plan, no con suerte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen al compartir la WEB: fondo negro, amarillo y blanco. */
export default function OpengraphImage() {
  const badge = readFileSync(join(process.cwd(), "public", "brand", "logo-badge.png"));
  const src = `data:image/png;base64,${badge.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#000", color: "#f6f5ef", padding: "64px 80px", borderBottom: "18px solid #facc15" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#facc15", letterSpacing: 6 }}>ELENITAFIT</div>
          <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 0.95, display: "flex", flexDirection: "column" }}>
            <span>ENTRENA CON</span>
            <span style={{ color: "#facc15" }}>PLAN, NO CON</span>
            <span>SUERTE</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, display: "flex" }}>Entreno personal, online y nutrición</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={300} height={300} alt="" />
      </div>
    ),
    size,
  );
}
