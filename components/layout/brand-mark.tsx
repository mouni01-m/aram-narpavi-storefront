import Image from "next/image";
import Link from "next/link";
import { imageAssets } from "@/lib/content/image-assets";

/**
 * The real Aram Narpavi logo, in its own colours and proportions. CSS sets only the height,
 * so the width always follows the file. The footer places it on an ivory panel, because its
 * green lettering is hard to read directly on forest green. See docs/BRAND_DESIGN.md.
 */
export function BrandMark() {
  const { src, width, height } = imageAssets.brand.logo;
  return (
    <Link className="brand-mark brand-mark--logo" href="/" aria-label="Aram Narpavi Herbals home">
      <Image className="brand-logo" src={src} alt="" width={width} height={height} sizes="180px" loading="eager" />
    </Link>
  );
}
