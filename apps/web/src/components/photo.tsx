import Image from "next/image";
import { cn } from "@elena/ui";

type PhotoProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/** Foto de stock (provisional: se sustituirá por fotos reales de Elena). */
export function Photo({ src, alt, sizes = "100vw", priority, className, imgClassName }: PhotoProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-raised", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover saturate-[1.1]", imgClassName)}
      />
    </div>
  );
}
