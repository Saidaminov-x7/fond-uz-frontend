import { adminApi } from "@/src/lib/admin-api";

export async function GET(request: Request) {
  return adminApi("/api/contacts/captcha", {
    method: "GET",
    headers: { "Accept-Language": request.headers.get("accept-language") ?? "en" },
  });
}
