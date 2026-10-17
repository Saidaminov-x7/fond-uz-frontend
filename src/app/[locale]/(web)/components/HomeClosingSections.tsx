import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { useTranslations } from "next-intl";

export function HomeClosingSections() {
  const t = useTranslations("home");

  return (
      <section className="home-content-section py-12 md:py-16">
        <Container>
          <div className="home-contact-cta">
            <div>
              <p className="section-kicker">{t("contactKicker")}</p>
              <h2>{t("contactQuestion")}</h2>
              <p>{t("contactDescription")}</p>
            </div>
            <Button href="/contacts">{t("contactCta")}</Button>
          </div>
        </Container>
      </section>
  );
}
