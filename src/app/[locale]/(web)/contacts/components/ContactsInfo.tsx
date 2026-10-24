import { Link } from "@/src/i18n/routing";
import { Card } from "@/src/components/ui/Card";
import { IconBadge } from "@/src/components/ui/IconBadge";
import { ArrowUpRight, Mail, MapPin, MessagesSquare, Phone } from "lucide-react";

type Props = {
  title: string;
  emptyText: string;
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  addressLabel: string;
  addressValue: string;
  servicesLabel: string;
  questionsLabel: string;
};

export function ContactsInfo({ title, emptyText, phoneLabel, phoneValue, emailLabel, emailValue, addressLabel, addressValue, servicesLabel, questionsLabel }: Props) {
  const entries = [
    { label: phoneLabel, value: phoneValue, href: phoneValue ? `tel:${phoneValue.replace(/[^+\d]/g, "")}` : undefined, Icon: Phone },
    { label: emailLabel, value: emailValue, href: emailValue ? `mailto:${emailValue}` : undefined, Icon: Mail },
    { label: addressLabel, value: addressValue, Icon: MapPin },
  ].filter((entry) => entry.value.trim());

  return (
    <Card className="contact-info-card">
      <section className="contact-info-panel" aria-labelledby="contact-info-title">
        <h2 id="contact-info-title">{title}</h2>
        {entries.length ? (
          <dl className="contact-info-list">
            {entries.map(({ label, value, href, Icon }) => (
              <div className="contact-info-entry" key={label}>
                <IconBadge><Icon size={20} strokeWidth={1.8} /></IconBadge>
                <div className="contact-info-copy">
                  <dt>{label}</dt>
                  <dd>{href ? <a href={href}>{value}</a> : value}</dd>
                </div>
              </div>
            ))}
          </dl>
        ) : <p className="contact-info-empty">{emptyText}</p>}
        <div className="contact-info-accent" aria-hidden="true"><MessagesSquare size={34} strokeWidth={1.5} /></div>
        <nav className="contact-info-links" aria-label={title}>
          <Link href="/services">{servicesLabel} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/faqs">{questionsLabel} <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </section>
    </Card>
  );
}
