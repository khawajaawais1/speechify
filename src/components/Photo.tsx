import Image from "next/image";

/** Brand-graded photo. Wraps next/image so heavy source JPEGs are
 *  re-encoded to responsive AVIF/WebP and colour-matched to the palette.
 *  `overlay="scrim"` adds a dark foot for white text sitting on the image. */
export function Photo({
  src, alt, className = "", imgClassName = "", sizes = "100vw",
  priority = false, grade = true, overlay = "tint", quality = 82, fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  grade?: boolean;
  overlay?: "tint" | "scrim" | "none";
  /** Transient frames can go lower to save payload. */
  quality?: number;
  /**
   * A real prop rather than something passed through `imgClassName`: both
   * `object-cover` and `object-contain` sit in the same Tailwind layer, so
   * whichever one the stylesheet happens to define later wins regardless of the
   * order they appear in the class string. Only one may ever be emitted.
   */
  fit?: "cover" | "contain";
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
        quality={quality}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} ${
          grade ? "grade" : ""
        } ${imgClassName}`}
      />
    </div>
  );
}
