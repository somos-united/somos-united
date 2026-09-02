import { NextResponse, type NextRequest } from "next/server";

/**
 * Gates everything under /preview (the in-progress Phase 1 site) behind a
 * simple HTTP Basic Auth prompt — Danny's own browser will remember the
 * credentials after one entry, no separate login page needed. Everything
 * else (the public holding page at /, /de, /en) stays fully ungated,
 * exactly as it is today; this middleware never runs for those paths (see
 * `matcher` below).
 *
 * Credentials live in Vercel env vars (PREVIEW_AUTH_USER/PASSWORD), never
 * hardcoded here — same convention as every other secret in this project
 * (01-ARCHITECTURE.md §5).
 */
export function middleware(request: NextRequest) {
  const expectedUser = process.env.PREVIEW_AUTH_USER;
  const expectedPassword = process.env.PREVIEW_AUTH_PASSWORD;

  // Fail closed: if the gate isn't configured, never serve the in-progress
  // site by accident.
  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Preview auth is not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice("Basic ".length), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const suppliedUser = decoded.slice(0, separatorIndex);
    const suppliedPassword = decoded.slice(separatorIndex + 1);

    if (suppliedUser === expectedUser && suppliedPassword === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Somos United Preview"' },
  });
}

export const config = {
  matcher: "/preview/:path*",
};
