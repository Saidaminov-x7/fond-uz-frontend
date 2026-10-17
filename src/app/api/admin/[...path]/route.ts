import { adminApi } from "@/src/lib/admin-api";
type Context = { params: Promise<{ path: string[] }> };
const allowed = ["users", "doctors", "services", "funds", "news", "faqs", "prices", "contacts"];
async function forward(request: Request, context: Context) {
  const { path } = await context.params;
  if (!path?.length || path.some((part) => !/^[a-z0-9-]+$/i.test(part))) return Response.json({ error: "Invalid path" }, { status: 404 });
  const url = new URL(request.url);
  if (path.length > 2 || !allowed.includes(path[0]) || (path.length === 2 && !/^[a-z0-9-]{1,100}$/i.test(path[1]))) return Response.json({ error: "Not found" }, { status: 404 });
  if (path[0] === "contacts" && (path.length !== 1 || request.method !== "GET")) return Response.json({ error: "Method not allowed" }, { status: 405 });
  const id = url.searchParams.get("id");
  const query = new URLSearchParams([...url.searchParams.entries()].filter(([key]) => ["limit", "offset"].includes(key))).toString();
  const resourcePath = path[0] === "users" ? "/api/users/all" : `/api/${path[0]}${path[1] ? `/${encodeURIComponent(path[1])}` : id ? `/${encodeURIComponent(id)}` : ""}`;
  const apiPath = `${resourcePath}${query ? `?${query}` : ""}`;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  const init: RequestInit = { method: request.method };
  if (body) {
    init.body = body;
    init.headers = { "Content-Type": "application/json" };
  }
  return adminApi(apiPath, init);
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
