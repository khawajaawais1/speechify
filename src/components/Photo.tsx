import Image from "next/image";

/** Brand-graded photo. Wraps next/image so heavy source JPEGs are
 *  re-encoded to responsive AVIF/WebP and colour-matched to the palette.
 *  `overlay="scrim"` adds a dark foot for white text sitting on the image. */
export function Photo({
  src, alt, className = "", imgClassName = "", sizes = "100vw",
  priority = false, grade = true, overlay = "tint",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  grade?: boolean;
  overlay?: "tint" | "scrim" | "none";
}) {
  const wrap =
    overlay === "none" ? "" : overlay === "scrim" ? "grade-wrap on-photo" : "grade-wrap";
  return (
    <div className={`${wrap} relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={82}
        className={`object-cover ${grade ? "grade" : ""} ${imgClassName}`}
      />
    </div>
  );
}
