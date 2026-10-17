import { Link } from "@/src/i18n/routing";

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
    { label: phoneLabel, value: phoneValue, href: phoneValue ? `tel:${phoneValue.replace(/[^+\d]/g, "")}` : undefined },
    { label: emailLabel, value: emailValue, href: emailValue ? `mailto:${emailValue}` : undefined },
    { label: addressLabel, value: addressValue },
  ].filter((entry) => entry.value.trim());

  return (
    <section className="contact-info-panel" aria-labelledby="contact-info-title">
      <h2 id="contact-info-title">{title}</h2>
      {entries.length ? (
        <dl>
          {entries.map(({ label, value, href }) => (
            <div className="contact-info-entry" key={label}>
              <dt>{label}</dt>
              <dd>{href ? <a href={href}>{value}</a> : value}</dd>
            </div>
          ))}
        </dl>
      ) : <p>{emptyText}</p>}
      <nav className="contact-info-links" aria-label={title}>
        <Link href="/services">{servicesLabel} <span aria-hidden="true">{"\u2197"}</span></Link>
        <Link href="/faqs">{questionsLabel} <span aria-hidden="true">{"\u2197"}</span></Link>
      </nav>
    </section>
  );
}
