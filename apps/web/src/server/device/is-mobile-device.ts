// @vitest-skip-coverage - server-only next/headers utility.
import "server-only";

import { headers } from "next/headers";
import Bowser from "bowser";

export async function isMobileDevice() {
  const ua = (await headers()).get("user-agent") ?? "";

  return Bowser.getParser(ua).getPlatformType(true) === "mobile";
}
