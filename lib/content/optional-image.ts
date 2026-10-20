import { existsSync } from "node:fs";
import { join } from "node:path";

/** Server-side existence check keeps missing optional public assets out of rendered markup. */
export function getOptionalImage(src: string): string | null {
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, ""))) ? src : null;
}
