import { Container } from "@/src/components/ui/Container";
import { getDoctors } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DoctorInfo } from "./components/DoctorInfo";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function DoctorDetailsPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("doctors");
  const tc = await getTranslations("common");

  const doctor = (await getDoctors(locale)).find((item) => item.id === id);
  if (!doctor) notFound();

  return (
    <div className="public-page-flow">
      <Container className="doctor-profile-page pt-12 md:pt-16">
        <DoctorInfo
          doctor={doctor}
          backText={tc("backToList")}
          emailText={t("email")}
          phoneText={t("phone")}
          aboutText={t("about")}
        />
      </Container>
    </div>
  );
}

