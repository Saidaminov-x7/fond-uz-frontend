import { Container } from "@/src/components/ui/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactsHero } from "./components/ContactsHero";
import { ContactsInfo } from "./components/ContactsInfo";
import { ContactForm } from "./components/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");
  const common = await getTranslations("home");

  return (
    <Container className="py-12 md:py-16">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="mx-auto w-full">
          <ContactsHero title={t("title")} subtitle={t("subtitle")} />
          <ContactsInfo
            phoneLabel={t("phoneLabel")}
            phoneValue={t("phoneValue")}
            emailLabel={t("emailLabel")}
            emailValue={t("emailValue")}
            addressLabel={t("addressLabel")}
            addressValue={t("addressValue")}
          />
        </div>

        <div className="w-full">
          <div className="concept-note mb-6" role="note"><span className="concept-note-mark" aria-hidden="true">i</span><div><strong>{common("conceptTitle")}</strong><p>{common("conceptBody")}</p></div></div>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}

