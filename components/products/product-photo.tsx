import { OptionalImage } from "@/components/ui/optional-image";

/**
 * Product image with a named neutral placeholder beneath it. The placeholder fills the
 * frame, so a missing or failed photo keeps the layout and never shows a broken icon.
 */
export function ProductPhoto({ image, name, sizes, className = "" }: {
  image: { src: string; alt: string; focus?: string } | null;
  name: string;
  sizes: string;
  className?: string;
}) {
  return (
    <span className={`product-photo ${className}`.trim()}>
      <span className="product-photo__fallback" {...(image ? { "aria-hidden": true } : { role: "img", "aria-label": `${name}: product photo not yet available` })}>
        <span className="product-photo__name">{name}</span>
        <span className="product-photo__note">Photo not yet available</span>
      </span>
      {image ? <OptionalImage src={image.src} alt={image.alt} sizes={sizes} focus={image.focus} /> : null}
    </span>
  );
}
