import { adminApi } from "@/src/lib/admin-api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 8_192;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Invalid request" }, { status: 413 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.consent !== true) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const captchaId = typeof body.captchaId === "string" ? body.captchaId.trim() : "";
  const captchaAnswer = typeof body.captchaAnswer === "string" ? body.captchaAnswer.trim() : "";
  const hasContact = Boolean(email || phone);
  if (name.length < 2 || name.length > 120 || !hasContact || (email && (!EMAIL_PATTERN.test(email) || email.length > 254)) || phone.length > 32 || message.length < 5 || message.length > 3_000) {
    return Response.json({ error: "Invalid contact request" }, { status: 400 });
  }

  return adminApi("/api/contacts", {
    method: "POST",
    body: JSON.stringify({ name, ...(email ? { email } : {}), ...(phone ? { phone } : {}), message, consent: true, captchaId, captchaAnswer }),
  });
}
