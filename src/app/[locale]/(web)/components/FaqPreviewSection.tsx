import { Accordion } from "@/src/components/ui/Accordion";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import type { HomeFaqItem } from "../utils/types";

type Props = { title: string; subtitle: string; items: HomeFaqItem[]; viewAll: string };

export function FaqPreviewSection({ title, subtitle, items, viewAll }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="faq-home-section py-12 md:py-16">
      <Container>
        <Accordion title={title} subtitle={subtitle} items={items} />
        <div className="mt-6"><Button href="/faqs" variant="secondary">{viewAll}</Button></div>
      </Container>
    </section>
  );
}
