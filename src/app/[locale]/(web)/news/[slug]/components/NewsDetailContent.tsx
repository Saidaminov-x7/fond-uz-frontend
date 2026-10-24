import Image from "next/image";
import { Link } from "@/src/i18n/routing";

type NewsItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  content: string[];
};

type Props = {
  item: NewsItem;
  backText: string;
};

export function NewsDetailContent({ item, backText }: Props) {
  return (
    <>
      <Link
        href="/news"
        className="group text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> {backText}
      </Link>

      <div className="relative mt-8 h-80 md:h-[450px] w-full overflow-hidden rounded-card border border-border/50 bg-card shadow-card">
        <Image
          src={item.image}
          alt={item.title}
          fill
          unoptimized={item.image.startsWith("https://")}
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <article className="news-article mt-10 mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">{item.date}</p>
        <h1 className="font-serif text-3xl text-foreground md:text-4xl lg:text-5xl leading-tight">
          {item.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-medium">
          {item.subtitle}
        </p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground md:text-lg border-t border-border/50 pt-10">
          {item.content.map((paragraph, index) => (
            <p key={`${item.slug}-${index}`} className="first-letter:text-2xl first-letter:font-serif first-letter:text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </>
  );
}
