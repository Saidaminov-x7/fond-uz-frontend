"use client";

import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = ["/", "/about", "/services", "/doctors", "/prices", "/news", "/faqs", "/contacts"] as const;

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>;
}

function MenuIcon({ close }: { close: boolean }) {
  return close
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
}

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
    const closeMobileMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopBreakpoint.addEventListener("change", closeMobileMenu);
    return () => desktopBreakpoint.removeEventListener("change", closeMobileMenu);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const input = window.matchMedia("(min-width: 1024px)").matches
      ? desktopSearchInputRef.current
      : menuOpen ? mobileSearchInputRef.current : null;
    if (!input) return;
    const frame = window.requestAnimationFrame(() => input.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>("a, button, input, [tabindex]:not([tabindex='-1'])")?.focus();
    });
    const containFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      } else if (event.key === "Tab") {
        const items = Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []).filter((item) => item.getClientRects().length > 0);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", containFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", containFocus);
    };
  }, [menuOpen]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim().slice(0, 100);
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const switchLanguage = (nextLocale: "uz" | "ru" | "en") => {
    router.replace(pathname, { locale: nextLocale });
    setMenuOpen(false);
  };

  const languageButtons = (mobile = false) => (
    <div className={`site-language-list${mobile ? " is-mobile" : ""}`} role="group" aria-label={t("language")}>
      {(["uz", "ru", "en"] as const).map((code) => <button key={code} type="button" onClick={() => switchLanguage(code)} aria-current={locale === code ? "true" : undefined} aria-label={t(`languageNames.${code}`)} className="site-language">{code}</button>)}
    </div>
  );

  const searchForm = (id: string, open: boolean, mobile = false) => (
    <form id={id} hidden={!open} className={`site-search-form${mobile ? " mobile-search-form" : ""}`} role="search" onSubmit={submitSearch}>
      <label className="sr-only" htmlFor={`${id}-input`}>{t("search")}</label>
      <Input ref={mobile ? mobileSearchInputRef : desktopSearchInputRef} id={`${id}-input`} name="q" type="search" maxLength={100} placeholder={t("searchPlaceholder")} />
      <Button type="submit" size="sm">{t("search")}</Button>
    </form>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">{locale === "ru" ? "Перейти к основному содержимому" : locale === "uz" ? "Asosiy mazmunga o‘tish" : "Skip to main content"}</a>
      <header className="site-header sticky top-0 z-50 w-full border-b border-border bg-background">
        <Container>
          <div className="site-header-main">
            <Link href="/" locale={locale} className="site-brand" aria-label={`Fond_Uz — ${t("tagline")}`}>
              <span className="site-brand-name">Fond_Uz</span>
              <span className="site-brand-tagline">{t("tagline")}</span>
            </Link>

            <nav className="site-desktop-nav" aria-label={t("mainNavigation")}>
              {navLinks.map((href) => {
                const key = href === "/" ? "home" : href.slice(1);
                const active = navActive(pathname, href);
                return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`site-desktop-nav-item${active ? " is-active" : ""}`}>{t(key)}</Link>;
              })}
            </nav>

            <div className="site-header-actions">
              <div className="site-header-search">
                <button type="button" className="site-header-action" aria-expanded={searchOpen} aria-controls="site-search-desktop" onClick={() => setSearchOpen((open) => !open)}>
                  <SearchIcon /><span>{searchOpen ? t("closeSearch") : t("search")}</span>
                </button>
                {searchForm("site-search-desktop", searchOpen)}
              </div>
              {languageButtons()}
              <ThemeToggle />
              <Link href="/contacts" className="site-feedback-link">{t("feedback")}</Link>
            </div>

            <button ref={menuButtonRef} type="button" onClick={() => setMenuOpen((open) => !open)} className="site-menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t("closeMenu") : t("openMenu")}>
              <MenuIcon close={menuOpen} />
            </button>
          </div>
        </Container>

        <div id="mobile-navigation" ref={mobileMenuRef} className="site-mobile-menu" role="dialog" aria-modal="true" aria-label={t("mainNavigation")} hidden={!menuOpen}>
          <div className="site-mobile-backdrop" aria-hidden="true" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }} />
          <Container className="site-mobile-menu-panel">
            <div className="site-mobile-menu-header">
              <span>{t("mainNavigation")}</span>
              <Button type="button" variant="ghost" size="sm" className="site-mobile-close" aria-label={t("closeMenu")} onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}>
                <MenuIcon close />
              </Button>
            </div>
            <nav className="site-mobile-nav" aria-label={t("mainNavigation")}>
              {navLinks.map((href) => {
                const key = href === "/" ? "home" : href.slice(1);
                const active = navActive(pathname, href);
                return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`site-mobile-nav-item${active ? " is-active" : ""}`}>{t(key)}</Link>;
              })}
              <button type="button" onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen} aria-controls="site-search-mobile" className="site-mobile-search-toggle"><SearchIcon />{searchOpen ? t("closeSearch") : t("search")}</button>
              {searchForm("site-search-mobile", searchOpen, true)}
              {languageButtons(true)}
              <div className="site-mobile-theme"><span>{tc("theme")}</span><ThemeToggle /></div>
              <Link href="/contacts" onClick={() => setMenuOpen(false)} className="site-mobile-feedback">{t("feedback")}</Link>
            </nav>
          </Container>
        </div>
      </header>
    </>
  );
}
