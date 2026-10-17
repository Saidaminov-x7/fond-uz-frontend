"use client";

import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

type CollectionStats = { news: number; faqs: number; doctors: number; services: number; prices: number; funds: number };
const collections = ["news", "faqs", "doctors", "services", "prices", "funds"] as const;
const routes: Record<(typeof collections)[number], string> = {
  news: "/admin/news", faqs: "/admin/faqs", doctors: "/admin/doctors", services: "/admin/services", prices: "/admin/prices", funds: "/admin/funds",
};

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all(collections.map(async (collection) => {
      const response = await fetch(`/api/admin/${collection}?limit=1`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load admin summary");
      const payload = await response.json() as { total?: number };
      return [collection, typeof payload.total === "number" ? payload.total : 0] as const;
    })).then((entries) => { if (active) setStats(Object.fromEntries(entries) as CollectionStats); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  return <div>
    <header className="admin-page-header">
      <div><p className="admin-eyebrow">FondUz / {t("workspace")}</p><h1 className="admin-page-title">{t("title")}</h1><p className="admin-page-description">{t("description")}</p></div>
    </header>
    {loadError && <p className="admin-error" role="status">{t("loadError")}</p>}
    <section className="admin-count-grid" aria-label={t("collections")}>
      {collections.map((collection) => <Link key={collection} href={routes[collection]} locale={locale} className="admin-count-link">
        <span className="admin-count-label">{t(collection)}</span>
        <span className="admin-count-bottom"><span className="admin-count-value">{stats ? stats[collection] : <span aria-label={t("loading")}>вЂ”</span>}</span><span className="admin-count-arrow" aria-hidden="true">в†—</span></span>
      </Link>)}
    </section>
    <section className="admin-focus-block"><h2 className="admin-focus-title">{t("contentIndex")}</h2><p className="admin-focus-copy">{t("contentIndexDescription")}</p></section>
  </div>;
}
