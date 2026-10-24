import { Container } from "@/src/components/ui/Container";
import { getNews } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { NewsDetailContent } from "./components/NewsDetailContent";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const item = (await getNews(locale)).find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <div className="public-page-flow">
      <Container className="pt-12 md:pt-16">
        <NewsDetailContent
          item={item}
          backText={t("back")}
        />
      </Container>
    </div>
  );
}

