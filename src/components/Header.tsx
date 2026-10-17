"use client";

import { Container } from "@/src/components/ui/Container";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = ["/about", "/services", "/doctors", "/prices", "/news", "/faqs", "/contacts"] as const;

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>;
}

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const th = useTranslations("home");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLanguage = (nextLocale: "uz" | "ru" | "en") => {
    router.replace(pathname, { locale: nextLocale });
    setMenuOpen(false);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="concept-strip"><Container><p className="m-0">{th("topline")}</p></Container></div>
        <Container>
          <div className="site-header-main flex min-h-[4.4rem] w-full items-center justify-between gap-4">
            <Link href="/" locale={locale} className="flex shrink-0 flex-col gap-0.5 text-foreground transition-opacity hover:opacity-80">
              <span className="font-serif text-xl leading-none font-medium tracking-tight md:text-2xl">Fond_Uz</span>
              <span className="text-[10px] leading-tight text-muted-foreground">{t("tagline")}</span>
            </Link>
            <div className="hidden items-center gap-4 lg:flex">
              <Link href="/search" className="site-header-action inline-flex items-center gap-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground" aria-label={t("search")}>
                <SearchIcon />{t("search")}
              </Link>
              <span className="site-theme-action text-[11px] font-medium text-foreground">{tc("theme")}</span>
              <ThemeToggle />
              <Link href="/contacts" className="site-feedback-link inline-flex min-h-9 items-center border border-primary px-3 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">{t("feedback")}</Link>
            </div>
          </div>
        </Container>
        <Container>
          <div className="site-header-nav-row flex min-h-[2.2rem] w-full items-center justify-between gap-4">
            <nav className="site-desktop-nav hidden items-center lg:flex" aria-label={t("mainNavigation")}>
              {navLinks.map((href) => {
                const key = href.slice(1);
                const active = navActive(pathname, href);
                return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`site-desktop-nav-item${active ? " is-active" : ""}`}>{t(key)}</Link>;
              })}
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-0.5 lg:flex" aria-label={t("language")}>{(["uz", "ru", "en"] as const).map((code) => <button key={code} type="button" onClick={() => switchLanguage(code)} aria-current={locale === code ? "true" : undefined} aria-label={t(`languageNames.${code}`)} className="site-language rounded px-1.5 py-1 text-[10px] font-semibold uppercase transition-colors">{code}</button>)}</div>
              <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t("closeMenu") : t("openMenu")}>
                {menuOpen ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>}
              </button>
            </div>
          </div>
        </Container>
        {menuOpen && <div id="mobile-navigation" className="site-mobile-menu border-t border-border bg-background lg:hidden"><Container>
          <nav className="flex max-h-[min(70vh,calc(100dvh-4rem))] flex-col gap-1.5 overflow-y-auto py-4" aria-label={t("mainNavigation")}>
            {navLinks.map((href) => {
              const key = href.slice(1);
              const active = navActive(pathname, href);
              return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`block rounded px-4 py-3 text-base font-semibold transition-colors ${active ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{t(key)}</Link>;
            })}
            <Link href="/search" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><SearchIcon/>{t("search")}</Link>
            <div className="mt-3 flex gap-2" aria-label={t("language")}>{(["uz", "ru", "en"] as const).map((code) => <button key={code} type="button" onClick={() => switchLanguage(code)} aria-current={locale === code ? "true" : undefined} aria-label={t(`languageNames.${code}`)} className="site-language flex-1 rounded border border-border py-3 text-sm font-semibold uppercase">{code}</button>)}</div>
            <div className="mt-2 flex items-center justify-between rounded border border-border bg-card px-4 py-2"><span className="text-sm font-semibold text-foreground">{tc("theme")}</span><ThemeToggle /></div>
          </nav>
        </Container></div>}
      </header>
    </>
  );
}
