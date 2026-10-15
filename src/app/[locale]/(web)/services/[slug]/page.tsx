import { professions } from "@/src/features/services/data/services";
import { getFunds, getServices } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ServiceHero } from "./components/ServiceHero";
import { FundList } from "./components/FundList";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return professions.map((profession) => ({ slug: profession.slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  
  const [services, allFunds] = await Promise.all([getServices(locale), getFunds(locale)]);
  const profession = services.find((item) => item.slug === slug);
  if (!profession) notFound();
  
  const fundsForProfession = allFunds.filter((item) => item.professionSlug === slug);

  return (
    <div className="pb-16 md:pb-24">
      <ServiceHero
        title={profession.name}
        subtitle={t("fundsCount", { count: fundsForProfession.length })}
        backText={t("back")}
      />
      
      <FundList
        funds={fundsForProfession}
        phoneLabel={t("phone")}
        websiteLabel={t("website")}
        extraInfoLabel={t("extraInfo")}
        partnerTitle={t("partnerTitle")}
        emptyText={t("emptyPartners")}
      />
    </div>
  );
}

