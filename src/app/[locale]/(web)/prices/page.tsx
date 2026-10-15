import { getPrices } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PricesHero } from "./components/PricesHero";
import { PricesContainer } from "./components/PricesContainer";

type Props = { params: Promise<{ locale: string }> };

export default async function PricesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prices");
  const prices = await getPrices(locale);

  return (
    <div className="pb-16 md:pb-24">
      <PricesHero title={t("title")} subtitle={t("subtitle")} />
      <PricesContainer
        items={prices}
        toggleListText={t("toggleList")}
        toggleCardsText={t("toggleCards")}
        includesText={t("includes")}
      />
    </div>
  );
}

