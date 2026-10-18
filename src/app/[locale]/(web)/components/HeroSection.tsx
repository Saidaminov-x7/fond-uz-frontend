import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type Props = { title: string; subtitle: string; actionLabel: string; eyebrow: string; secondaryLabel: string; imageAlt?: string; children?: ReactNode };

export function HeroSection({ title, subtitle, actionLabel, eyebrow, secondaryLabel, imageAlt, children }: Props) {
  const t = useTranslations("home");
  return (
    <section className="hero-section">
      <Container className="py-5 sm:py-7 lg:py-8">
        <div className="hero-breadcrumb"><span>Fond_Uz</span><span aria-hidden="true">/</span><span>{eyebrow}</span></div>
        <p className="hero-topline">{t("topline")}</p>
        <div className="hero-panel">
          <div className="hero-copy">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-description">{subtitle}</p>
            <div className="hero-actions"><Button href="/services" size="lg" className="hero-primary">{actionLabel}</Button><Link href="/about" className="hero-secondary">{secondaryLabel}</Link></div>
          </div>
          <figure className="hero-visual">
            <Image src="/img/samarkand-registan.webp" alt={imageAlt || t("heroImageAlt")} fill priority sizes="(max-width: 768px) 100vw, 45vw" className="hero-photo" />
          </figure>
        </div>
        {children}
      </Container>
    </section>
  );
}
