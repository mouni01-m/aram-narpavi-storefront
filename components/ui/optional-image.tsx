"use client";

import Image from "next/image";
import { useState } from "react";

export function OptionalImage({ src, alt, className = "", sizes, priority = false, focus }: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** CSS object-position, for crops that must keep a subject in frame. */
  focus?: string;
}) {
  const [failed, setFailed] = useState(false);
  // Unmounting on error (rather than swapping src) means a failure can never loop.
  if (failed) return null;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} className={className} style={focus ? { objectPosition: focus } : undefined} />;
}
