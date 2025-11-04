import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale =
    segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as (typeof SUPPORTED_LOCALES)[number]);

  if (segments.length === 0) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  if (!hasLocale) {
    segments[0] = DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${segments.join("/")}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

