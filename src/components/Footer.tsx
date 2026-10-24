"use client";

import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const pageLinks = ["/", "/about", "/services", "/doctors", "/prices", "/news", "/faqs", "/contacts"];

  return (
    <footer className="site-footer mt-auto border-t border-border py-10 md:py-12">
      <Container>
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-xl text-foreground">Fond_Uz</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("description")}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("pages")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {pageLinks.map((href) => <li key={href}><Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">{tNav(href === "/" ? "home" : href.slice(1))}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("contacts")}</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <Link href="/contacts" className="site-footer-contact">{t("contactAction")} <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-sm text-muted-foreground">
          <p>{t("copyright")}</p><Link href="/privacy-policy" className="hover:text-foreground">{t("privacyLink")}</Link>
        </div>
      </Container>
    </footer>
  );
}
