import type { Doctor, FAQItem, FundItem, NewsItem, PriceItem, ServiceProfession } from "@/src/types/domain";
import { apiGetJson } from "./api-client";

type Locale = "ru" | "en" | "uz";
type Collection<T> = { items: T[]; total: number };
type LocalizedValue = string | string[];
const localeSuffix: Record<Locale, "" | "En" | "Uz"> = { ru: "", en: "En", uz: "Uz" };
const fallbackImage = "/img/samarkand-registan.webp";

function safeImage(value: unknown) {
  if (typeof value !== "string") return fallbackImage;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try { return new URL(value).protocol === "https:" ? value : fallbackImage; }
  catch { return fallbackImage; }
}

function resolveLocale(locale: string): Locale {
  return locale === "en" || locale === "uz" ? locale : "ru";
}

async function load<T>(path: string, fallback: T[]): Promise<{ items: T[]; fromApi: boolean }> {
  const result = await apiGetJson<Collection<T>>(path);
  return result && Array.isArray(result.items)
    ? { items: result.items, fromApi: true }
    : { items: fallback, fromApi: false };
}

function mergeLocale<T extends object>(item: T, locale: Locale, fields: Record<string, string>) {
  const source = item as Record<string, unknown>;
  const suffix = localeSuffix[locale];
  const projected: Record<string, unknown> = { ...(item as Record<string, unknown>) };
  for (const [target, sourceKey] of Object.entries(fields)) {
    const localized = source[suffix ? `${sourceKey}${suffix}` : sourceKey] as LocalizedValue | undefined;
    if (localized !== undefined && localized !== "") projected[target] = localized;
  }
  return projected as T;
}

export async function getDoctors(localeName: string = "ru"): Promise<Doctor[]> {
  const locale = resolveLocale(localeName);
  const { items } = await load<Doctor>("/api/doctors", []);
  return items.map((item) => ({ ...mergeLocale(item, locale, {
    name: "name", profession: "specialty", bio: "bio",
  }), image: safeImage(item.image) }));
}

export async function getNews(localeName: string = "ru"): Promise<NewsItem[]> {
  const locale = resolveLocale(localeName);
  const { items } = await load<NewsItem>("/api/news", []);
  return items.map((item) => ({ ...mergeLocale(item, locale, {
    title: "title", subtitle: "subtitle", content: "content",
  }), image: safeImage(item.image) }));
}

export async function getFaqs(localeName: string = "ru"): Promise<FAQItem[]> {
  const locale = resolveLocale(localeName);
  const { items } = await load<FAQItem>("/api/faqs", []);
  return items.map((item) => mergeLocale(item, locale, {
    question: "question", answer: "answer",
  }));
}

export async function getPrices(localeName: string = "ru"): Promise<PriceItem[]> {
  const locale = resolveLocale(localeName);
  const { items } = await load<PriceItem>("/api/prices", []);
  return items.map((item) => mergeLocale(item, locale, {
    title: "title", price: "price", includes: "includes",
  }));
}

export async function getServices(localeName: string = "ru"): Promise<ServiceProfession[]> {
  const locale = resolveLocale(localeName);
  const [collection, allFunds] = await Promise.all([
    load<ServiceProfession>("/api/services", []),
    getFunds(locale),
  ]);
  return collection.items.map((item) => ({ ...mergeLocale(item, locale, {
    name: "name",
  }),
  fundsCount: allFunds.filter((fund) => fund.professionSlug === item.slug).length,
  }));
}

export async function getFunds(localeName: string = "ru"): Promise<FundItem[]> {
  const locale = resolveLocale(localeName);
  const { items } = await load<FundItem>("/api/funds", []);
  return items.map((item) => mergeLocale(item, locale, {
    name: "name", description: "description",
  }));
}
