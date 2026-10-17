import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";

type Props = { title: string; subtitle: string; homeLabel: string };

export function FaqsHero({ title, subtitle, homeLabel }: Props) {
  return (
    <Container className="faq-page-heading">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/">{homeLabel}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
      </nav>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </Container>
  );
}
