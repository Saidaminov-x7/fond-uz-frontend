const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(request: Request, namespace: string, limit: number, windowMs: number): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "unknown";
  const key = `${namespace}:${client}`;
  const now = Date.now(); const current = buckets.get(key);
  if (!current || current.reset <= now) { buckets.set(key, { count: 1, reset: now + windowMs }); return false; }
  current.count += 1;
  if (buckets.size > 5000) for (const [entry, bucket] of buckets) if (bucket.reset <= now) buckets.delete(entry);
  return current.count > limit;
}
