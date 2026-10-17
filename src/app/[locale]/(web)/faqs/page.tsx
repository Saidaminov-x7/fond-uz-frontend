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
      {faqs.length ? <FaqsList items={faqs} /> : <p className="empty-state mx-auto max-w-6xl px-6 py-10 text-base text-muted-foreground sm:px-8 lg:px-12">{t("reviewPending")}</p>}
    </div>
  );
}

