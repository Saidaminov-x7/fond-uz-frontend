import { getTranslations, setRequestLocale } from "next-intl/server";
import { getNews } from "@/src/lib/content";
import { BlogHero } from "./components/BlogHero";
import { NewsGrid } from "../news/components/NewsGrid";

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BlogPage");
  const nav = await getTranslations("nav");
  const home = await getTranslations("home");
  const newsLabels = await getTranslations("news");
  const articles = await getNews(locale);

  return (
    <div className="pb-16 md:pb-24">
      <BlogHero title={t("title")} subtitle={t("sub")} homeLabel={nav("home")} />
      {articles.length ? <NewsGrid items={articles} openText={newsLabels("open")} /> : <p className="empty-state mx-auto max-w-6xl px-6 py-10 text-base text-muted-foreground sm:px-8 lg:px-12">{home("reviewPending")}</p>}
    </div>
  );
}

