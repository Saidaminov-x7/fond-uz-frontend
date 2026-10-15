import type { Doctor, FAQItem, FundItem, NewsItem, PriceItem, ServiceProfession } from "@/src/types/domain";
import en from "@/src/messages/en.json";
import ru from "@/src/messages/ru.json";
import uz from "@/src/messages/uz.json";
import { apiGetJson } from "./api-client";
import { doctors as fallbackDoctors } from "@/src/features/doctors/data/doctors";
import { news as fallbackNews } from "@/src/features/news/data/news";
import { faqs as fallbackFaqs } from "@/src/features/faqs/data/faqs";
import { prices as fallbackPrices } from "@/src/features/prices/data/prices";
import { professions as fallbackServices } from "@/src/features/services/data/services";

type Locale = "ru" | "en" | "uz";
type Collection<T> = { items: T[]; total: number };
type LocalizedValue = string | string[];
type LocalizedRecord = {
  title?: string; subtitle?: string; content?: string[]; question?: string; answer?: string;
  name?: string; profession?: string; bio?: string; specialty?: string; price?: string;
  includes?: string[]; fundsCount?: number;
};

const recordMessages: Record<Locale, {
  news: Record<string, Partial<NewsItem>>;
  faqs: FAQItem[];
  services: Record<string, Partial<ServiceProfession>>;
  doctors: Record<string, Partial<Doctor>>;
  prices: Record<string, Partial<PriceItem>>;
}> = {
  ru: ru.records,
  en: en.records,
  uz: uz.records,
};

const localeSuffix: Record<Locale, "" | "En" | "Uz"> = { ru: "", en: "En", uz: "Uz" };

function resolveLocale(locale: string): Locale {
  return locale === "en" || locale === "uz" ? locale : "ru";
}

async function load<T>(path: string, fallback: T[]): Promise<{ items: T[]; fromApi: boolean }> {
  const result = await apiGetJson<Collection<T>>(path);
  return result && Array.isArray(result.items)
    ? { items: result.items, fromApi: true }
    : { items: fallback, fromApi: false };
}

function fallbackRecords(locale: Locale, fromApi: boolean) {
  return fromApi ? undefined : recordMessages[locale];
}

function mergeLocale<T extends object>(item: T, locale: Locale, fields: Record<string, string>, fallback: object = {}) {
  const source = item as Record<string, unknown>;
  const suffix = localeSuffix[locale];
  const projected: Record<string, unknown> = { ...(item as Record<string, unknown>) };
  if (suffix) Object.assign(projected, fallback);
  for (const [target, sourceKey] of Object.entries(fields)) {
    const localized = source[suffix ? `${sourceKey}${suffix}` : sourceKey] as LocalizedValue | undefined;
    if (localized !== undefined && localized !== "") projected[target] = localized;
  }
  if (!suffix) Object.assign(projected, fallback);
  return projected as T;
}

export async function getDoctors(localeName: string = "ru"): Promise<Doctor[]> {
  const locale = resolveLocale(localeName);
  const { items, fromApi } = await load("/api/doctors", fallbackDoctors);
  return items.map((item) => mergeLocale(item, locale, {
    name: "name", profession: "specialty", bio: "bio",
  }, fallbackRecords(locale, fromApi)?.doctors[item.id] ?? {}));
}

export async function getNews(localeName: string = "ru"): Promise<NewsItem[]> {
  const locale = resolveLocale(localeName);
  const { items, fromApi } = await load("/api/news", fallbackNews);
  return items.map((item) => mergeLocale(item, locale, {
    title: "title", subtitle: "subtitle", content: "content",
  }, fallbackRecords(locale, fromApi)?.news[item.slug] ?? {}));
}

export async function getFaqs(localeName: string = "ru"): Promise<FAQItem[]> {
  const locale = resolveLocale(localeName);
  const { items, fromApi } = await load("/api/faqs", fallbackFaqs);
  return items.map((item, index) => mergeLocale(item, locale, {
    question: "question", answer: "answer",
  }, fallbackRecords(locale, fromApi)?.faqs[index] ?? {}));
}

export async function getPrices(localeName: string = "ru"): Promise<PriceItem[]> {
  const locale = resolveLocale(localeName);
  const { items, fromApi } = await load("/api/prices", fallbackPrices);
  return items.map((item) => mergeLocale(item, locale, {
    title: "title", price: "price", includes: "includes",
  }, fallbackRecords(locale, fromApi)?.prices[item.id] ?? {}));
}

export async function getServices(localeName: string = "ru"): Promise<ServiceProfession[]> {
  const locale = resolveLocale(localeName);
  const [collection, allFunds] = await Promise.all([
    load("/api/services", fallbackServices),
    getFunds(locale),
  ]);
  return collection.items.map((item) => ({ ...mergeLocale(item, locale, {
    name: "name",
  }, fallbackRecords(locale, collection.fromApi)?.services[item.slug] ?? {}),
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

export type { LocalizedRecord };
