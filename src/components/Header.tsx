"use client";
// Hydration fix touch
import { Container } from "@/src/components/ui/Container";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";


function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

import { siteConfig } from "@/src/config/site";

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = siteConfig.mainNav.map(item => item.href);

  const toggleLanguage = () => {
    const nextLocale = locale === "uz" ? "ru" : "uz";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <Container>
        <div className="flex h-16 w-full items-center justify-between gap-4">
          <Link href="/" locale={locale} className="flex shrink-0 items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground md:text-xl">
              {tc("brand")}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((href) => {
              const active = navActive(pathname, href);
              const key = href === "/" ? "home" : href.slice(1);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-300 md:text-[13px] ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-card px-3 text-[12px] font-bold uppercase text-foreground hover:bg-muted transition-all active:scale-95"
            >
              {locale}
            </button>

            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>


            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border/50 text-foreground transition-all hover:bg-muted lg:hidden shadow-sm"
              aria-expanded={menuOpen}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="border-t border-border bg-background lg:hidden overflow-hidden"
          >
            <Container>
              <nav className="flex max-h-[min(70vh,calc(100dvh-4rem))] flex-col gap-1.5 overflow-y-auto py-4">
                {navLinks.map((href, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-base font-semibold transition-all ${
                        navActive(pathname, href)
                          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {t(href === "/" ? "home" : href.slice(1))}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 flex gap-3 px-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const currentSearch = window.location.search;
                      router.replace(pathname + currentSearch, { locale: "uz" });
                      setMenuOpen(false);
                    }}
                    className={`h-12 flex-1 rounded-2xl text-sm font-bold transition-all ${locale === "uz" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border border-border bg-card text-foreground"}`}
                  >
                    UZBEK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSearch = window.location.search;
                      router.replace(pathname + currentSearch, { locale: "ru" });
                      setMenuOpen(false);
                    }}
                    className={`h-12 flex-1 rounded-2xl text-sm font-bold transition-all ${locale === "ru" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border border-border bg-card text-foreground"}`}
                  >
                    RUSSIAN
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 flex px-1"
                >
                  <div className="flex h-12 w-full items-center justify-between rounded-md border border-border bg-card px-4">
                    <span className="text-sm font-semibold text-foreground">Dark Mode</span>
                    <ThemeToggle />
                  </div>
                </motion.div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
