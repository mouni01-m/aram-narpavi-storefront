"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { imageAssets } from "@/lib/content/image-assets";

/** Temporary wordmark fallback. Replace only when the approved brand asset is supplied. */
export function BrandMark() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  return (
    <Link className="brand-mark" href="/" aria-label="Aram Narpavi Herbals home">
      {logoLoaded ? <span className="brand-logo-frame"><Image src={imageAssets.brand.logo} alt="" fill sizes="180px" onError={() => setLogoLoaded(false)} /></span> : <>
        <span className="brand-name">ARAM NARPAVI</span>
        <span className="brand-descriptor">Herbals</span>
      </>}
      {!logoLoaded ? <Image className="brand-logo-prefetch" src={imageAssets.brand.logo} alt="" width={180} height={48} onLoad={() => setLogoLoaded(true)} onError={() => setLogoLoaded(false)} /> : null}
    </Link>
  );
}
