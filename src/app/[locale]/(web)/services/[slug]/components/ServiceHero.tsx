import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";

type Props = {
  title: string;
  subtitle: string;
  backText: string;
};

export function ServiceHero({ title, subtitle, backText }: Props) {
  return (
    <section className="public-page-hero border-b border-border py-10 md:py-14">
      <Container>
        <Link
          href="/services"
          className="group text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> {backText}
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base font-medium">{subtitle}</p>
      </Container>
    </section>
  );
}
