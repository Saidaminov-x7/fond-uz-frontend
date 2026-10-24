"use client";

import { useMemo, useState } from "react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { useTranslations } from "next-intl";

type FAQItem = { question: string; answer: string; category?: string };
type Props = { items: FAQItem[] };

export function FaqsList({ items }: Props) {
  const t = useTranslations("faqs");
  const [query, setQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [filter, setFilter] = useState("");
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const filteredItems = items.filter((item) => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const searchableText = filter === "questions" ? item.question : filter === "answers" ? item.answer : `${item.question} ${item.answer}`;
    const matchesText = !normalizedQuery || searchableText.toLocaleLowerCase().includes(normalizedQuery);
    if (!matchesText) return false;
    return !filter.startsWith("category:") || item.category?.trim() === filter.slice("category:".length);
  });

  return (
    <Container className="faq-content">
      {items.length > 0 ? <form role="search" className="faq-search" onSubmit={(event) => { event.preventDefault(); setQuery(queryInput); }}>
        <label className="faq-search-field">
          <span>{t("searchLabel")}</span>
          <Input type="search" value={queryInput} onChange={(event) => setQueryInput(event.target.value)} placeholder={t("searchPlaceholder")} />
        </label>
        <Button type="submit" size="lg" className="faq-search-submit">{t("searchAction")}</Button>
        <label className="faq-filter">
          <span className="sr-only">{t("filterLabel")}</span>
          <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">{t("allCategories")}</option>
            <option value="questions">{t("questionsOnly")}</option>
            <option value="answers">{t("answersOnly")}</option>
            {categories.length ? <optgroup label={t("topicCategories")}>{categories.map((item) => <option key={item} value={`category:${item}`}>{item}</option>)}</optgroup> : null}
          </Select>
        </label>
        {filter || query || queryInput ? <Button variant="ghost" size="sm" type="button" className="faq-reset" onClick={() => { setFilter(""); setQuery(""); setQueryInput(""); }}>{t("resetFilters")}</Button> : null}
      </form> : null}

      {filteredItems.length ? (
        <div className="faq-results" aria-live="polite">
          {filteredItems.map((item, index) => (
            <details className="faq-item" key={`${item.question}-${index}`} open={index === 0 && !query && !filter}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
      ) : (
        <p className="faq-empty" role="status">{items.length ? t("noResults") : t("emptyList")}</p>
      )}

      <section className="faq-contact-cta" aria-labelledby="faq-contact-heading">
        <div>
          <h2 id="faq-contact-heading">{t("contactQuestion")}</h2>
          <p>{t("contactDescription")}</p>
        </div>
        <Button href="/contacts" variant="secondary" className="faq-contact-action">{t("contactAction")} <span aria-hidden="true">{"\u2192"}</span></Button>
      </section>
    </Container>
  );
}
