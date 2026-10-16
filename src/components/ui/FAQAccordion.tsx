"use client";

import { useState } from "react";

type Item = { question: string; answer: string };

export function FAQAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="rounded-lg border border-border bg-card shadow-sm transition-all hover:bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors"
            >
              <span className="font-semibold text-foreground">{item.question}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen ? <div className="border-t border-border/20 px-5 py-4 text-sm leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">{item.answer}</div> : null}
          </div>

        );
      })}
    </div>
  );
}
