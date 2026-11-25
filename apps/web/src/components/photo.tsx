import Image from "next/image";
import { cn } from "@elena/ui";

type PhotoProps = {
  src: string;
  alt: string;
  /** mono = blanco y negro · yellow = duotono amarillo/negro */
  tone?: "mono" | "yellow";
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/** Foto de stock con tratamiento de marca (provisional: se sustituirá por fotos reales de Elena). */
export function Photo({ src, alt, tone = "mono", sizes = "100vw", priority, className, imgClassName }: PhotoProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", tone === "yellow" ? "bg-volt" : "bg-ink-2", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover",
          tone === "yellow" ? "mix-blend-multiply grayscale contrast-125 brightness-110" : "grayscale contrast-110",
          imgClassName,
        )}
      />
    </div>
  );
}
