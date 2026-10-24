import { Container } from "@/src/components/ui/Container";
import { Pagination } from "@/src/components/ui/Pagination";
import { getNews } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsHero } from "./components/NewsHero";
import { NewsGrid } from "./components/NewsGrid";
import { getPaginatedNews, PAGE_SIZE } from "./utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const home = await getTranslations("home");
  const news = await getNews(locale);

  const { items, totalPages, currentPage } = getPaginatedNews(
    news,
    Number(page) || 1,
    PAGE_SIZE
  );

  return (
    <div className="public-page-flow">
      <NewsHero title={t("title")} subtitle={t("subtitle")} />
      {items.length ? <NewsGrid items={items} openText={t("open")} /> : <Container className="py-10 md:py-14"><p className="empty-state text-base text-muted-foreground">{home("reviewPending")}</p></Container>}
      <Container>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news" />
      </Container>
    </div>
  );
}

