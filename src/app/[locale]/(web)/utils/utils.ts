import { getFaqs, getNews } from "@/src/lib/content";
import type { HomeFaqItem, HomeNewsCard } from "./types";

export async function getHomePreviewNews(locale: string): Promise<HomeNewsCard[]> {
  return (await getNews(locale)).slice(0, 3) as HomeNewsCard[];
}

export async function getHomePreviewFaqs(locale: string): Promise<HomeFaqItem[]> {
  return (await getFaqs(locale)).slice(0, 4) as HomeFaqItem[];
}
