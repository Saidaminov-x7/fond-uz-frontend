import { getFaqs } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqsHero } from "./components/FaqsHero";
import { FaqsList } from "./components/FaqsList";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqs");
  const faqs = await getFaqs(locale);

  return (
    <div className="pb-16 md:pb-24">
      <FaqsHero title={t("title")} subtitle={t("subtitle")} />
      <FaqsList items={faqs} />
    </div>
  );
}

