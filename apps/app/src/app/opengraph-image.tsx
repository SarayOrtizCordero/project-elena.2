import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Elena Fit · Tu progreso, a tu ritmo (App, Demo 2)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** DEMO 2 · APP: fondo amarillo #FACC15, texto negro y un móvil oscuro. */
export default function OpengraphImage() {
  const badge = readFileSync(join(process.cwd(), "public", "brand", "logo-badge-ink.png"));
  const src = `data:image/png;base64,${badge.toString("base64")}`;
  const c = 2 * Math.PI * 46;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#facc15",
          color: "#000",
          padding: "56px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 640 }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                background: "#000",
                color: "#facc15",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 5,
                padding: "10px 22px",
                borderRadius: 999,
              }}
            >
              APP · DEMO 2
            </div>
          </div>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1, display: "flex", flexDirection: "column" }}>
            <span>TU PROGRESO,</span>
            <span>A TU RITMO</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, display: "flex" }}>Entrenos, comidas y progreso · Elena Fit</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={120} height={120} alt="" />
        </div>

        <div
          style={{
            width: 300,
            height: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "10px solid #000",
            borderRadius: 54,
            background: "#0b0b0c",
            color: "#fff",
            padding: "46px 20px 20px",
            gap: 18,
          }}
        >
          <svg width="170" height="170" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="#1b1b1f" strokeWidth="11" />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke="#facc15"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={`${c * 0.62} ${c}`}
              transform="rotate(-90 55 55)"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 900 }}>1.330 kcal</div>
          <div style={{ display: "flex", width: "100%", height: 14, background: "#1b1b1f", borderRadius: 999 }}>
            <div style={{ display: "flex", width: "62%", background: "#facc15", borderRadius: 999 }} />
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>10 de 16 series</div>
        </div>
      </div>
    ),
    size,
  );
}
