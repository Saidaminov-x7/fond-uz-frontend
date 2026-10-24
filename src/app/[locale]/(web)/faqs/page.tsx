import { getFaqs } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqsHero } from "./components/FaqsHero";
import { FaqsList } from "./components/FaqsList";
import "./faqs.css";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqs");
  const nav = await getTranslations("nav");
  const faqs = await getFaqs(locale);

  return (
    <div className="public-page-flow">
      <FaqsHero title={t("title")} subtitle={faqs.length ? t("subtitle") : undefined} homeLabel={nav("home")} />
      <FaqsList items={faqs} />
    </div>
  );
}

