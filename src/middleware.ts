import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSecurityHeaders } from "@/utils/security";

/**
 * Security middleware – runs on every matched request.
 *
 * Responsibilities:
 *  1. Enforce HTTPS by redirecting plain-HTTP requests in production.
 *  2. Attach all security headers (CSP, HSTS, X-Frame-Options, …) to every response.
 */
export function middleware(request: NextRequest): NextResponse {
  // --- HTTPS enforcement (production only) ---
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  const response = NextResponse.next();

  // Attach every security header to the outgoing response
  for (const { key, value } of getSecurityHeaders()) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  // Apply to all routes except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
