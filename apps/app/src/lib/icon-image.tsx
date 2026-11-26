import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Icono PWA: marca de Elena (mancuerna-corazón) en amarillo sobre cobalto. */
export function renderIcon(size: number) {
  // Ya viene teñida: el generador de imágenes recortaba la marca si se usaba como máscara
  const png = readFileSync(join(process.cwd(), "public", "brand", "logo-mark-yellow.png"));
  const src = `data:image/png;base64,${png.toString("base64")}`;
  // Cabe en la zona segura de los iconos "maskable" (círculo del 80 %)
  const w = Math.round(size * 0.64);
  const h = Math.round(w * (289 / 400));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b3fc4",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={w} height={h} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
