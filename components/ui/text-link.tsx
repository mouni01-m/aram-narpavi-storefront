import Link from "next/link";
import type { ComponentProps } from "react";

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link className={`text-link ${className}`.trim()} {...props} />;
}
