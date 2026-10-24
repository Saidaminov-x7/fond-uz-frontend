import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutHero } from "./components/AboutHero";
import { Container } from "@/src/components/ui/Container";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="public-page-flow">
      <AboutHero title={t("title")} subtitle={t("subtitle")} />
      <Container className="pt-10 md:pt-14">
        <div className="concept-note" role="note"><span className="concept-note-mark" aria-hidden="true">i</span><div><strong>{t("conceptTitle")}</strong><p>{t("conceptBody")}</p></div></div>
        <p className="mt-7 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{t("body")}</p>
      </Container>
    </div>
  );
}

