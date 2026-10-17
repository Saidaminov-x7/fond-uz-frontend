import { getServices } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesHero } from "./components/ServicesHero";
import { ProfessionList } from "./components/ProfessionList";
import "./services.css";

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const nav = await getTranslations("nav");
  const professions = await getServices(locale);

  return (
    <div className="pb-16 md:pb-24">
      <ServicesHero title={t("title")} subtitle={t("subtitle")} homeLabel={nav("home")} />
      <ProfessionList professions={professions} />
    </div>
  );
}

