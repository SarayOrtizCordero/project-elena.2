import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Elena Fit · Entrena con plan, no con suerte (Web, Demo 2)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** DEMO 2 · WEB: fondo negro, amarillo #FACC15 y blanco. */
export default function OpengraphImage() {
  const badge = readFileSync(join(process.cwd(), "public", "brand", "logo-badge-white.png"));
  const src = `data:image/png;base64,${badge.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#000",
          color: "#f6f5ef",
          padding: "64px 80px",
          borderBottom: "18px solid #facc15",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                border: "3px solid #facc15",
                color: "#facc15",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 5,
                padding: "8px 22px",
                borderRadius: 999,
              }}
            >
              WEB · DEMO 2
            </div>
          </div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, display: "flex", flexDirection: "column" }}>
            <span>ENTRENA CON</span>
            <span style={{ color: "#facc15" }}>PLAN, NO CON</span>
            <span>SUERTE</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#a1a1aa", display: "flex" }}>
            Elena Fit · Presencial y online
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={280} height={280} alt="" />
      </div>
    ),
    size,
  );
}
