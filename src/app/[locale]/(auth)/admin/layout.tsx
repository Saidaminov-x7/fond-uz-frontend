"use client";

import { ReactNode, useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { useLocale, useTranslations } from "next-intl";
import "./admin.css";

const languageOrder = ["ru", "en", "uz"] as const;
const navItems = [
  ["dashboard", "overview", "/admin"],
  ["inbox", "inbox", "/admin/inbox"],
  ["news", "news", "/admin/news"],
  ["faqs", "faqs", "/admin/faqs"],
  ["doctors", "doctors", "/admin/doctors"],
  ["prices", "prices", "/admin/prices"],
  ["services", "services", "/admin/services"],
  ["funds", "funds", "/admin/funds"],
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("adminDashboard");
  const [isReady, setIsReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/session", { cache: "no-store" }).then((response) => {
      if (!active) return;
      if (response.ok) setIsReady(true);
      else router.replace("/login");
    }).catch(() => router.replace("/login"));
    return () => { active = false; };
  }, [router]);

  const nextLocale = languageOrder[(languageOrder.indexOf(locale as typeof languageOrder[number]) + 1) % languageOrder.length];
  const switchLanguage = () => router.replace(pathname, { locale: nextLocale });
  const handleLogout = () => {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => router.push("/login"));
  };

  if (!isReady) return <div className="admin-checking" role="status">{t("checkingAccess")}</div>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand" aria-label="FondUz admin">
          <span className="admin-brand-mark" aria-hidden="true">F</span>
          <span><strong>FondUz</strong><small>{t("workspace")}</small></span>
        </Link>
        <nav className="admin-nav" aria-label={t("navigation")}>
          <span className="admin-nav-label">{t("navigation")}</span>
          {navItems.map(([key, label, href], index) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return <Link key={key} href={href} aria-current={active ? "page" : undefined} className={`admin-nav-link${active ? " is-active" : ""}`}>
              <span className="admin-nav-index">{String(index + 1).padStart(2, "0")}</span><span>{t(label)}</span>
            </Link>;
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-public-link"><span aria-hidden="true">↗</span>{t("viewSite")}</Link>
          <p>FONDUZ · CONTENT MANAGEMENT</p>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-toolbar">
          <button className="admin-mobile-menu" type="button" aria-expanded={mobileOpen} aria-controls="admin-mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>
            <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span><span>{t("menu")}</span>
          </button>
          <div className="admin-toolbar-spacer" />
          <span className="admin-session-label"><span aria-hidden="true" />{t("signedIn")}</span>
          <button type="button" onClick={switchLanguage} className="admin-language" aria-label={`${t("language")}: ${nextLocale.toUpperCase()}`}>
            {locale.toUpperCase()} <span aria-hidden="true">⌄</span>
          </button>
          <ThemeToggle />
          <button type="button" onClick={handleLogout} className="admin-logout">{t("logout")}</button>
        </header>
        {mobileOpen && <nav id="admin-mobile-nav" className="admin-mobile-nav" aria-label={t("navigation")}>
          {navItems.map(([key, label, href]) => <Link key={key} href={href} onClick={() => setMobileOpen(false)} aria-current={pathname === href ? "page" : undefined}>{t(label)}</Link>)}
        </nav>}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
