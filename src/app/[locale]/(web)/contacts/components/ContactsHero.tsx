import { Link } from "@/src/i18n/routing";

type Props = { title: string; subtitle: string; homeLabel: string };

export function ContactsHero({ title, subtitle, homeLabel }: Props) {
  return (
    <header className="contact-page-heading">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/">{homeLabel}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
      </nav>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
