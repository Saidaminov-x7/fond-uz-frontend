import { getPublicApiBaseUrl } from "./env";

/**
 * GET к API только если задан NEXT_PUBLIC_API_URL.
 * При ошибке или отсутствии URL возвращает null — UI должен показывать заглушки.
 */
export async function apiGetJson<T>(path: string): Promise<T | null> {
  const base = getPublicApiBaseUrl();
  if (!base) return null;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json", ...(typeof window === "undefined" && process.env.CLOUDFLARE_ORIGIN_SECRET ? { "X-FondUz-Origin": process.env.CLOUDFLARE_ORIGIN_SECRET } : {}) },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
