import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  eyebrow: string;
  secondaryLabel: string;
  imageAlt: string;
};

export function HeroSection({ title, subtitle, actionLabel, eyebrow, secondaryLabel, imageAlt }: Props) {
  const t = useTranslations("home");
  return (
    <section className="hero-section">
      <Container className="py-6 sm:py-8 lg:py-10">
        <div className="hero-panel">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span className="hero-eyebrow-dot" />{eyebrow}</p>
            <h1 className="hero-title">{title}</h1>
            <p className="hero-description">{subtitle}</p>
            <div className="hero-actions">
              <Button href="/services" size="lg" className="hero-primary">{actionLabel}</Button>
              <Link href="/about" className="hero-secondary">{secondaryLabel}<span aria-hidden="true">→</span></Link>
            </div>
            <div className="hero-languages" aria-label="Русский, English, O‘zbekcha">
              <span>RU</span><span>EN</span><span>UZ</span>
            </div>
          </div>
          <figure className="hero-visual">
            <Image
              src="/img/samarkand-registan.webp"
              alt={imageAlt}
              fill
              priority
              fetchPriority="high"
              quality={78}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 48vw, 620px"
              className="object-cover"
            />
            <div className="hero-image-shade" />
            <figcaption className="hero-caption"><span className="hero-caption-mark" />FondUz <span>·</span> {t("heroCountry")}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
