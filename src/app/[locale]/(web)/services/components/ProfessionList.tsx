"use client";

import { useMemo, useState } from "react";
import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

type Profession = {
  slug: string;
  name: string;
  fundsCount: number;
  category?: string;
};

type Props = { professions: Profession[] };

export function ProfessionList({ professions }: Props) {
  const t = useTranslations("services");
  const [query, setQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [filter, setFilter] = useState("");
  const categories = useMemo(
    () => [...new Set(professions.map((item) => item.category?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)),
    [professions],
  );
  const visibleProfessions = professions.filter((profession) => {
    const matchesQuery = profession.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    if (!matchesQuery) return false;
    if (filter === "with-organizations") return profession.fundsCount > 0;
    if (filter === "without-organizations") return profession.fundsCount === 0;
    if (filter.startsWith("category:")) return profession.category?.trim() === filter.slice("category:".length);
    return true;
  });

  return (
    <Container className="service-page-content">
      {professions.length > 0 ? <><form className="service-search" role="search" onSubmit={(event) => { event.preventDefault(); setQuery(queryInput); }}>
        <label className="service-search-field">
          <span>{t("searchLabel")}</span>
          <input
            type="search"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
          />
        </label>
        <button type="submit" className="service-search-submit">{t("searchAction")}</button>
      </form>

      <div className="service-filter-row">
        <label className="service-filter">
          <span className="sr-only">{t("filterLabel")}</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">{t("allCategories")}</option>
            <option value="with-organizations">{t("withOrganizations")}</option>
            <option value="without-organizations">{t("withoutOrganizations")}</option>
            {categories.length ? <optgroup label={t("topicCategories")}>{categories.map((item) => <option key={item} value={`category:${item}`}>{item}</option>)}</optgroup> : null}
          </select>
        </label>
        {filter || query || queryInput ? (
          <button className="service-reset" type="button" onClick={() => { setFilter(""); setQuery(""); setQueryInput(""); }}>{t("resetFilters")}</button>
        ) : null}
      </div></> : null}

      {visibleProfessions.length ? (
        <ul className="service-results" aria-live="polite">
          {visibleProfessions.map((profession) => (
            <li key={profession.slug}>
              <Link href={`/services/${profession.slug}`} className="service-result-link">
                <span>
                  <span className="service-result-title">{profession.name}</span>
                  {profession.category ? <span className="service-result-category">{profession.category}</span> : null}
                </span>
                <span className="service-result-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="service-empty" role="status">{professions.length ? t("noResults") : t("emptyList")}</p>
      )}
    </Container>
  );
}
