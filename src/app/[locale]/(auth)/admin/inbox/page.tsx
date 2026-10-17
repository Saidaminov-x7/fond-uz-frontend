"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Submission = {
  id?: string | number;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  consent?: unknown;
  createdAt?: unknown;
};
type ContactPage = { items: Submission[]; total: number; limit: number; offset: number };
const pageSize = 20;
const displayValue = (value: unknown) => typeof value === "string" || typeof value === "number" ? String(value) : "";

export default function AdminInboxPage() {
  const t = useTranslations("adminInbox");
  const locale = useLocale();
  const [data, setData] = useState<ContactPage | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const pageCount = useMemo(() => Math.max(1, Math.ceil((data?.total ?? 0) / pageSize)), [data?.total]);

  const loadPage = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/admin/contacts?limit=${pageSize}&offset=${page * pageSize}`, { cache: "no-store", signal });
      if (!response.ok) throw new Error("Contact inbox could not be loaded");
      const result = await response.json() as Partial<ContactPage>;
      if (!Array.isArray(result.items) || typeof result.total !== "number") throw new Error("Invalid contact inbox response");
      setData({ items: result.items, total: Math.max(0, result.total), limit: pageSize, offset: page * pageSize });
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const controller = new AbortController();
    void loadPage(controller.signal);
    return () => controller.abort();
  }, [loadPage, retryCount]);

  const formatDate = (value: unknown) => {
    const raw = displayValue(value);
    const date = new Date(raw);
    if (!raw || Number.isNaN(date.getTime())) return t("unknownDate");
    try { return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date); }
    catch { return raw; }
  };

  const rangeStart = data?.total ? data.offset + 1 : 0;
  const rangeEnd = data ? Math.min(data.offset + data.items.length, data.total) : 0;

  return <section className="admin-inbox">
    <header className="admin-page-header">
      <div><p className="admin-eyebrow">{t("eyebrow")}</p><h1 className="admin-page-title">{t("title")}</h1><p className="admin-page-description">{t("description")}</p></div>
    </header>
    {error && <div className="admin-message admin-message-error" role="alert"><span>{t("error")}</span><button type="button" className="admin-button" onClick={() => setRetryCount((current) => current + 1)}>{t("retry")}</button></div>}
    {loading ? <p className="admin-empty" role="status">{t("loading")}</p> : !error && data?.items.length === 0 ? <div className="admin-inbox-empty"><span aria-hidden="true">—</span><p>{t("empty")}</p></div> : !error && data && data.items.length > 0 ? <>
      <p className="admin-inbox-range" aria-live="polite">{t("showing", { start: rangeStart, end: rangeEnd, total: data.total })}</p>
      <div className="admin-inbox-list">
        {data.items.map((submission, index) => {
          const name = displayValue(submission.name) || t("anonymous");
          const email = displayValue(submission.email);
          const phone = displayValue(submission.phone);
          const message = displayValue(submission.message);
          const consent = submission.consent === true;
          const id = submission.id == null ? `${data.offset}-${index}` : String(submission.id);
          return <article className="admin-inbox-item" key={id}>
            <div className="admin-inbox-item-head">
              <div className="admin-inbox-person"><h2>{name}</h2><div className="admin-inbox-contact">{email && <span>{email}</span>}{phone && <span>{phone}</span>}{!email && !phone && <span>{t("noContact")}</span>}</div></div>
              <time className="admin-inbox-date">{formatDate(submission.createdAt)}</time>
            </div>
            <p className="admin-inbox-message">{message || t("noMessage")}</p>
            <p className={`admin-inbox-consent${consent ? " is-consented" : ""}`}><span aria-hidden="true">{consent ? "✓" : "—"}</span>{consent ? t("consentYes") : t("consentNo")}</p>
          </article>;
        })}
      </div>
      <nav className="admin-inbox-pagination" aria-label={t("pagination")}>
        <button type="button" className="admin-button" disabled={page === 0 || loading} onClick={() => setPage((current) => Math.max(0, current - 1))}>{t("previous")}</button>
        <span aria-live="polite">{t("page", { current: Math.min(page + 1, pageCount), total: pageCount })}</span>
        <button type="button" className="admin-button" disabled={page + 1 >= pageCount || loading} onClick={() => setPage((current) => current + 1)}>{t("next")}</button>
      </nav>
    </> : null}
  </section>;
}
