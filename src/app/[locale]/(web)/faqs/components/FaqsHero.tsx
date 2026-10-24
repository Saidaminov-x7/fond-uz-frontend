import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";

type Props = { title: string; subtitle?: string; homeLabel: string };

export function FaqsHero({ title, subtitle, homeLabel }: Props) {
  return (
    <section className="public-page-hero border-b border-border py-12 md:py-16">
      <Container className="faq-page-heading">
        <nav aria-label="Breadcrumb" className="page-breadcrumb">
          <Link href="/">{homeLabel}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </Container>
    </section>
  );
}
