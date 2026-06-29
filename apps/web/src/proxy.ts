import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const accessPassword = process.env.APP_ACCESS_PASSWORD;
  const pathname = request.nextUrl.pathname;
  const isAccessRoute =
    pathname === "/access" || pathname.startsWith("/access/");

  if (accessPassword) {
    const hasAccess =
      request.cookies.get("wb_access")?.value === accessPassword;

    if (!hasAccess && !isAccessRoute) {
      const redirectUrl = new URL("/access", request.url);
      redirectUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search}`,
      );

      return NextResponse.redirect(redirectUrl);
    }

    if (hasAccess && pathname === "/access") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|webmanifest)$|sw.js).*)",
  ],
};
