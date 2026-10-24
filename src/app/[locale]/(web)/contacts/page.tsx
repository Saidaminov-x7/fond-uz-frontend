import { Container } from "@/src/components/ui/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactsHero } from "./components/ContactsHero";
import { ContactsInfo } from "./components/ContactsInfo";
import { ContactForm } from "./components/ContactForm";
import "./contacts.css";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");
  const nav = await getTranslations("nav");

  return (
    <>
      <section className="public-page-hero border-b border-border py-12 md:py-16">
        <Container><ContactsHero title={t("title")} subtitle={t("subtitle")} homeLabel={nav("home")} /></Container>
      </section>
      <Container className="contacts-page">
      <div className="contacts-layout">
        <div>
          <ContactForm />
        </div>
        <div>
          <ContactsInfo
            title={t("infoTitle")}
            emptyText={t("infoEmpty")}
            phoneLabel={t("phoneLabel")}
            phoneValue={t("phoneValue")}
            emailLabel={t("emailLabel")}
            emailValue={t("emailValue")}
            addressLabel={t("addressLabel")}
            addressValue={t("addressValue")}
            servicesLabel={nav("services")}
            questionsLabel={nav("faqs")}
          />
        </div>
      </div>
      </Container>
    </>
  );
}

