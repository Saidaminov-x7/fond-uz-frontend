import { adminApi } from "@/src/lib/admin-api";
type Context = { params: Promise<{ path: string[] }> };
const allowed = ["users", "doctors", "services", "funds", "news", "faqs", "prices"];
async function forward(request: Request, context: Context) {
  const { path } = await context.params;
  if (!path?.length || path.some((part) => !/^[a-z0-9-]+$/i.test(part))) return Response.json({ error: "Invalid path" }, { status: 404 });
  const url = new URL(request.url);
  if (path.length > 2 || !allowed.includes(path[0]) || (path.length === 2 && !/^[a-z0-9-]{1,100}$/i.test(path[1]))) return Response.json({ error: "Not found" }, { status: 404 });
  const id = url.searchParams.get("id");
  const query = new URLSearchParams([...url.searchParams.entries()].filter(([key]) => ["limit", "offset"].includes(key))).toString();
  const resourcePath = path[0] === "users" ? "/api/users/all" : `/api/${path[0]}${path[1] ? `/${encodeURIComponent(path[1])}` : id ? `/${encodeURIComponent(id)}` : ""}`;
  const apiPath = `${resourcePath}${query ? `?${query}` : ""}`;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  return adminApi(apiPath, { method: request.method, body, headers: { "Content-Type": "application/json" } });
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
