import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

type Props = { title: string; text: string; highlights: [string, string, string] | string[] };

const destinations = ["/services", "/faqs", "/contacts"] as const;

export function ActivitySection({ title }: Props) {
  const th = useTranslations("home");
  return (
    <section className="activity-section py-12 md:py-16">
      <Container>
        <div className="activity-intro">
          <h2>{title}</h2>
        </div>
        <nav className="activity-steps" aria-label={title}>
          {destinations.map((href) => {
            const key = href.slice(1);
            return <Link className="activity-step" href={href} key={href}><span className="activity-step-copy"><strong>{th(`start${key === "services" ? "One" : key === "faqs" ? "Two" : "Three"}Title`)}</strong><small>{th(`start${key === "services" ? "One" : key === "faqs" ? "Two" : "Three"}Text`)}</small></span><span className="activity-step-arrow" aria-hidden="true">{"\u2197"}</span></Link>;
          })}
        </nav>
      </Container>
    </section>
  );
}
