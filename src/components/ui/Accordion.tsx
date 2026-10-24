"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  title?: string;
  subtitle?: string;
  items: AccordionItem[];
};

export function Accordion({ title, subtitle, items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      {title ? <h2 className="font-serif text-2xl text-foreground md:text-3xl">{title}</h2> : null}
      {subtitle ? <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p> : null}
      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-card border border-border bg-card shadow-card transition-all hover:border-border"
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-muted/50"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className={`text-sm font-semibold md:text-base transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className="flex h-6 w-6 items-center justify-center rounded-pill bg-primary/10 text-primary"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="border-t border-border/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
