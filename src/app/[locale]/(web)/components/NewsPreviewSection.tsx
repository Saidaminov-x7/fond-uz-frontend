import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import type { HomeNewsCard } from "../utils/types";

type Props = { title: string; subtitle: string; cards: HomeNewsCard[]; readMore: string; viewAll: string };

export function NewsPreviewSection({ title, subtitle, cards, readMore, viewAll }: Props) {
  return (
    <section className="news-section py-16 md:py-24">
      <Container>
        <div className="section-heading">
          <div><p className="section-kicker">FondUz</p><h2>{title}</h2></div>
          <p>{subtitle}</p>
        </div>
        {cards.length > 0 ? (
          <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.slice(0, 3).map((item) => (
              <article key={item.slug} className="news-card">
                <Link href={`/news/${item.slug}`} className="news-card-image">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-[1.03]" />
                </Link>
                <div className="news-card-copy">
                  <h3><Link href={`/news/${item.slug}`}>{item.title}</Link></h3>
                  <p>{item.subtitle}</p>
                  <Link href={`/news/${item.slug}`} className="news-card-link">{readMore}<span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="empty-state mt-9">—</p>}
        <div className="mt-8"><Button href="/news" variant="secondary">{viewAll}</Button></div>
      </Container>
    </section>
  );
}
