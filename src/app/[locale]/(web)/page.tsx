import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqPreviewSection } from "./components/FaqPreviewSection";
import { ActivitySection } from "./components/ActivitySection";
import { HeroSection } from "./components/HeroSection";
import { HomeContentSections } from "./components/HomeContentSections";
import { HomeClosingSections } from "./components/HomeClosingSections";
import { NewsPreviewSection } from "./components/NewsPreviewSection";
import { getHomePreviewFaqs, getHomePreviewNews } from "./utils/utils";


type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const [newsCards, faqItems] = await Promise.all([getHomePreviewNews(locale), getHomePreviewFaqs(locale)]);

  return (
    <div>
      <HeroSection title={t("heroTitle")} subtitle={t("heroSubtitle")} actionLabel={t("heroCta")} eyebrow={t("heroEyebrow")} secondaryLabel={t("heroSecondaryCta")} imageAlt={t("heroImageAlt")} />
      <ActivitySection title={t("activityTitle")} />
      <HomeContentSections locale={locale} />
      <NewsPreviewSection title={t("newsTitle")} subtitle={t("newsSubtitle")} cards={newsCards} readMore={tc("view")} viewAll={t("viewAllNews")} />
      <FaqPreviewSection title={t("faqsTitle")} subtitle={t("faqsSubtitle")} items={faqItems} viewAll={t("viewAllFaqs")} />
      <HomeClosingSections />
    </div>
  );
}
