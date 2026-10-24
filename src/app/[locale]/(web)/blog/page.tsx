import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/src/components/ui/Container";
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
    <div className="public-page-flow">
      <BlogHero title={t("title")} subtitle={t("sub")} homeLabel={nav("home")} />
      {articles.length ? <NewsGrid items={articles} openText={newsLabels("open")} /> : <Container className="py-10 md:py-14"><p className="empty-state text-base text-muted-foreground">{home("reviewPending")}</p></Container>}
    </div>
  );
}

