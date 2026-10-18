"use client"
import { Container } from "@/src/components/ui/Container";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MotionViewport } from "@/src/components/ui/MotionViewport";
import { useTranslations } from "next-intl";

type PriceItem = {
  id: string;
  title: string;
  price: string;
  includes: string[];
};

type Props = {
  items: PriceItem[];
  toggleListText: string;
  toggleCardsText: string;
  includesText: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function PricesContainer({ items, toggleListText, toggleCardsText, includesText }: Props) {
  const t = useTranslations("home");
  const [view, setView] = useState<"list" | "cards">("list");

  return (
    <Container className="mt-10 md:mt-14">
      <div className={`${items.length === 0 ? "hidden" : "mb-6 hidden justify-end gap-2 md:flex"}`}>
        <button
          onClick={() => setView("list")}
          className={`rounded-xl border px-3 py-2 text-sm transition-all shadow-sm active:scale-95 ${
            view === "list" ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-card hover:bg-muted/50"
          }`}
        >
          {toggleListText}
        </button>
        <button
          onClick={() => setView("cards")}
          className={`rounded-xl border px-3 py-2 text-sm transition-all shadow-sm active:scale-95 ${
            view === "cards" ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-card hover:bg-muted/50"
          }`}
        >
          {toggleCardsText}
        </button>
      </div>

      <MotionViewport
        layout
        className={`grid grid-cols-1 gap-4 ${
          view === "cards" ? "md:grid-cols-2 xl:grid-cols-3" : "md:block md:space-y-4"
        }`}
      >
        {items.length === 0 && <p className="empty-state py-10 text-base text-muted-foreground">{t("reviewPending")}</p>}
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.article
              layout
              key={item.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="price-card rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-border"
            >
              <h2 className="font-serif text-xl text-foreground">{item.title}</h2>
              <p className="mt-2 text-lg font-semibold text-primary">{item.price}</p>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{includesText}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {item.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </AnimatePresence>
      </MotionViewport>
    </Container>
  );
}
