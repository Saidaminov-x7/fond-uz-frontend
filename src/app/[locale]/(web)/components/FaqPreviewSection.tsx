import { Accordion } from "@/src/components/ui/Accordion";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import type { HomeFaqItem } from "../utils/types";
import { useTranslations } from "next-intl";

type Props = { title: string; subtitle: string; items: HomeFaqItem[]; viewAll: string };

export function FaqPreviewSection({ title, subtitle, items, viewAll }: Props) {
  const t = useTranslations("home");
  return (
    <section className="faq-home-section py-12 md:py-16">
      <Container>
        {items.length > 0 ? <Accordion title={title} subtitle={subtitle} items={items} /> : <div className="faq-empty-preview"><p className="section-kicker">{t("faqKicker")}</p><h2>{title}</h2><p>{subtitle}</p><p className="faq-empty-note">{t("emptyFaqItem")}</p></div>}
        <div className="mt-6"><Button href="/faqs" variant="secondary">{viewAll}</Button></div>
      </Container>
    </section>
  );
}
