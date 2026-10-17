import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

function createCsp() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const nonce = btoa(String.fromCharCode(...bytes));
  const devScript = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  const upgrade = process.env.NODE_ENV === "production" ? " upgrade-insecure-requests;" : "";
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devScript}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';${upgrade}`;
}
function secureResponse(response: NextResponse, policy: string) {
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

async function hasValidAdminSession(token: string | undefined) {
  const apiBase = process.env.API_URL?.trim();
  if (!apiBase || !token) return false;
  try {
    const response = await fetch(new URL("/api/auth/session", apiBase), {
      headers: {
        Cookie: `fond_session=${token}`,
        Accept: "application/json",
        ...(process.env.CLOUDFLARE_ORIGIN_SECRET
          ? { "X-FondUz-Origin": process.env.CLOUDFLARE_ORIGIN_SECRET }
          : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const policy = createCsp();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", policy);
  requestHeaders.set("x-nonce", policy.match(/'nonce-([^']+)'/)?.[1] ?? "");
  const nonceRequest = new NextRequest(request, { headers: requestHeaders });

  // 1. Let API and static requests continue after origin and security checks.
  if (
    pathname.startsWith("/api") ||
    pathname.includes("_next") ||
    pathname.includes(".") // Matches static files like favicon.ico, images, etc.
  ) {
    return secureResponse(NextResponse.next({ request: { headers: requestHeaders } }), policy);
  }

  // 2. Protect admin routes
  // Checks if the path includes /admin (handles both /admin and /[locale]/admin)
  if (pathname.includes("/admin")) {
    const session = request.cookies.get("session")?.value;
    // The backend is the source of truth for admin sessions. The frontend must
    // not need a second copy of the backend signing secret.
    if (!(await hasValidAdminSession(session))) {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      return secureResponse(response, policy);
    }
  }

  // 3. Handle internationalization
  return secureResponse(intlMiddleware(nonceRequest), policy);
}

export const config = {
  // Use a matcher that covers all potential entry points
  matcher: ["/", "/api/:path*", "/(ru|en|uz)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
