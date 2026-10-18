"use client";

import { Container } from "@/src/components/ui/Container";
import { useTranslations } from "next-intl";
import { use } from "react";
import { motion } from "framer-motion";
import { MotionViewport } from "@/src/components/ui/MotionViewport";

type Props = { params: Promise<{ locale: string }> };

export default function PrivacyPolicyPage({ params }: Props) {
  use(params);
  const t = useTranslations("privacy");

  return (
    <div className="privacy-policy-page pb-16 md:pb-24 overflow-hidden">
      <section className="public-page-hero border-b border-border py-12 md:py-16">
        <Container>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl font-serif text-3xl text-foreground md:text-4xl lg:text-5xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base"
          >
            {t("sub")}
          </motion.p>
        </Container>
      </section>

      <Container className="mt-10 md:mt-14">
        <div className="max-w-3xl space-y-10">
          <MotionViewport
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-10"
          >
            <section>
              <h2 className="font-serif text-xl text-foreground">{t("section1Title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t("section1Desc")}</p>
            </section>
            <section className="privacy-highlight rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-xl text-foreground">{t("section2Title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t("section2Desc")}</p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-foreground">{t("section3Title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t("section3Desc")}</p>
            </section>
          </MotionViewport>
        </div>
      </Container>
    </div>
  );
}
