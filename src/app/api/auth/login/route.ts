import { NextResponse } from "next/server";
import { rateLimit } from "@/src/lib/rate-limit";

export async function POST(request: Request) {
  const size = Number(request.headers.get("content-length") ?? 0);
  if (size > 8_192) return NextResponse.json({ error: "Invalid request" }, { status: 413 });
  try {
    const blocked = rateLimit(request, "login", 5, 60_000);
    if (blocked) return NextResponse.json({ error: "Too many login attempts" }, { status: 429, headers: { "Retry-After": "60" } });
    const body = await request.json().catch(() => null);
    if (!body || typeof body.email !== "string" || typeof body.password !== "string" || body.email.length > 254 || body.password.length > 200) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const apiBase = process.env.API_URL?.trim();
    if (!apiBase) return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
    const backendResponse = await fetch(new URL("/api/auth/login", apiBase), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", ...(process.env.CLOUDFLARE_ORIGIN_SECRET ? { "X-FondUz-Origin": process.env.CLOUDFLARE_ORIGIN_SECRET } : {}), ...(request.headers.get("cf-connecting-ip") ? { "CF-Connecting-IP": request.headers.get("cf-connecting-ip")! } : {}) },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(8_000),
    });
    if (!backendResponse.ok) return NextResponse.json({ error: "Invalid credentials" }, { status: backendResponse.status === 429 ? 429 : 401, headers: backendResponse.status === 429 ? { "Retry-After": backendResponse.headers.get("Retry-After") ?? "60" } : undefined });
    const result = await backendResponse.json();
    const token = backendResponse.headers.getSetCookie().find((value) => value.startsWith("fond_session="));
    if (!token) return NextResponse.json({ error: "Authentication service unavailable" }, { status: 502 });
    const tokenValue = token.split(";")[0].slice("fond_session=".length);
    const response = NextResponse.json({ success: true, user: result.user });
    response.cookies.set("session", tokenValue, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
