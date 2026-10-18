import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

type Props = { title: string };

const destinations = ["/services", "/faqs", "/contacts"] as const;

export function ActivitySection({ title }: Props) {
  const th = useTranslations("home");
  return (
    <section className="activity-section" aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="activity-heading">{title}</h2>
      <nav className="activity-steps" aria-label={`${th("navigationKicker")}: ${title}`}>
        {destinations.map((href) => {
          const suffix = href === "/services" ? "One" : href === "/faqs" ? "Two" : "Three";
          return <Link className="activity-step" href={href} key={href}><span className="activity-step-copy"><strong>{th(`start${suffix}Title`)}</strong><small>{th(`start${suffix}Text`)}</small></span><span className="activity-step-arrow" aria-hidden="true">{"\u2197"}</span></Link>;
        })}
      </nav>
    </section>
  );
}
