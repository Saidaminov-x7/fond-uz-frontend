"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { Container } from "@/src/components/ui/Container";
import { motion, type Variants } from "framer-motion";
import { MotionViewport } from "@/src/components/ui/MotionViewport";

type NewsItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
};

type Props = {
  items: NewsItem[];
  openText: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function NewsGrid({ items, openText }: Props) {
  return (
    <Container>
      <MotionViewport className="news-grid grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <motion.article
            key={item.slug}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="news-listing-card overflow-hidden rounded-card border border-border bg-card shadow-card transition-all hover:border-border"
          >
            <div className="relative h-[250px] md:h-[250px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized={item.image.startsWith("https://")}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-col p-5 gap-3">
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <h3 className="mt-2 font-serif text-lg text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.subtitle}</p>
              <Link
                href={`/news/${item.slug}`}
                className="news-card-action mt-auto inline-flex w-fit rounded-control bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                {openText}
              </Link>
            </div>
          </motion.article>
        ))}
      </MotionViewport>
    </Container>
  );
}
