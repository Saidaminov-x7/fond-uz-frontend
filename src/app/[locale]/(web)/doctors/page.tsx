import { Container } from "@/src/components/ui/Container";
import { Pagination } from "@/src/components/ui/Pagination";
import { getDoctors } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DoctorsHero } from "./components/DoctorsHero";
import { DoctorsGrid } from "./components/DoctorsGrid";
import { getPaginatedItems, PAGE_SIZE } from "./utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function DoctorsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("doctors");
  const doctors = await getDoctors(locale);

  const { items: pageDoctors, totalPages, currentPage } = getPaginatedItems(
    doctors,
    Number(page) || 1,
    PAGE_SIZE
  );

  return (
    <div className="pb-16 md:pb-24">
      <DoctorsHero title={t("title")} subtitle={t("subtitle")} />
      <DoctorsGrid doctors={pageDoctors} openText={t("open")} />
      <Container>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/doctors" />
      </Container>
    </div>
  );
}

