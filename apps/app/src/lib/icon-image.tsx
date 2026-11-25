import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Icono PWA: marca de Elena (mancuerna-corazón) en amarillo sobre negro. */
export function renderIcon(size: number) {
  const png = readFileSync(join(process.cwd(), "public", "brand", "logo-mark-volt.png"));
  const src = `data:image/png;base64,${png.toString("base64")}`;
  const h = Math.round(size * 0.62);
  const w = Math.round(h * (226 / 314));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={w} height={h} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
