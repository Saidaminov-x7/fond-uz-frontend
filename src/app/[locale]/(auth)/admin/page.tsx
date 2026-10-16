"use client";

import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

type CollectionStats = { news: number; faqs: number; doctors: number; services: number; prices: number; funds: number };

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all(["news", "faqs", "doctors", "services", "prices", "funds"].map(async (collection) => {
      const response = await fetch(`/api/admin/${collection}?limit=1`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load admin summary");
      const payload = await response.json() as { total?: number };
      return [collection, typeof payload.total === "number" ? payload.total : 0] as const;
    })).then((entries) => {
      if (active) setStats(Object.fromEntries(entries) as CollectionStats);
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  const statCards = [
    { key: "news", labelKey: "news", href: "/admin/news", mark: "01" },
    { key: "faqs", labelKey: "faqs", href: "/admin/faqs", mark: "02" },
    { key: "doctors", labelKey: "doctors", href: "/admin/doctors", mark: "03" },
    { key: "services", labelKey: "services", href: "/admin/services", mark: "04" },
    { key: "prices", labelKey: "prices", href: "/admin/prices", mark: "05" },
    { key: "funds", labelKey: "funds", href: "/admin/funds", mark: "06" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">FondUz · {t("workspace")}</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t("title")}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{t("description")}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground"><span className="h-2 w-2 rounded-full bg-emerald-600" />{t("admin")}</span>
      </div>

      {loadError && <p role="status" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{t("loadError")}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.key} locale={locale} href={stat.href} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.12em] text-muted-foreground">{stat.mark}</span><span aria-hidden="true" className="text-lg text-primary transition-transform group-hover:translate-x-1">→</span></div>
            <p className="mt-7 text-sm font-semibold text-muted-foreground">{t(stat.labelKey)}</p>
            <p className="mt-1 font-serif text-4xl font-semibold tabular-nums text-foreground">{stats ? stats[stat.key] : <span className="text-2xl text-muted-foreground">···</span>}</p>
            <p className="mt-2 text-xs text-muted-foreground">{stats ? t("recordCount") : t("loading")}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{t("quickLinks")}</p><h2 className="mt-1 font-serif text-xl font-semibold text-foreground">{t("continueWork")}</h2></div><p className="text-xs text-muted-foreground">{t("chooseCollection")}</p></div>
        <div className="mt-2 divide-y divide-border">
          {statCards.map((stat) => <Link locale={locale} key={stat.key} href={stat.href} className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"><span>{t(stat.labelKey)}</span><span aria-hidden="true" className="text-lg text-primary">↗</span></Link>)}
        </div>
      </div>
    </div>
  );
}
