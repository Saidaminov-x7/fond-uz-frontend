import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import type { HomeNewsCard } from "../utils/types";
import { useTranslations } from "next-intl";

type Props = { title: string; subtitle: string; cards: HomeNewsCard[]; readMore: string; viewAll: string };

export function NewsPreviewSection({ title, subtitle, cards, readMore, viewAll }: Props) {
  const t = useTranslations("home");
  return (
    <section className="news-section py-16 md:py-24">
      <Container>
        <div className="section-heading"><div><p className="section-kicker">{t("publicationsKicker")}</p><h2>{title}</h2></div><p>{subtitle}</p></div>
        {cards.length > 0 ? <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">{cards.slice(0, 3).map((item) => <article key={item.slug} className="news-card">
          <div className="news-card-image"><Image src={item.image} alt={item.title} fill unoptimized={item.image.startsWith("https://")} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>
          <div className="news-card-copy"><h3>{item.title}</h3><p>{item.subtitle}</p><Link href={`/news/${item.slug}`} className="news-card-link">{readMore}<span aria-hidden="true">→</span></Link></div>
        </article>)}</div> : <p className="empty-state mt-8">{t("emptyNewsText")}</p>}
        <div className="mt-8"><Button href="/news" variant="secondary">{viewAll}</Button></div>
      </Container>
    </section>
  );
}
