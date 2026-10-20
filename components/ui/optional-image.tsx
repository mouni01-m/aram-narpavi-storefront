"use client";

import Image from "next/image";
import { useState } from "react";

export function OptionalImage({ src, alt, className = "", sizes, priority = false }: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} className={className} />;
}
