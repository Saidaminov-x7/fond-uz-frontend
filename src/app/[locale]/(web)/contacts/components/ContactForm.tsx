"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ContactForm({}: Record<string, never>) {
  const t = useTranslations("contacts");
  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4 rounded-md border border-border bg-card p-6 text-left md:p-8"
    >
      <h2 className="font-serif text-xl text-foreground">{t("feedbackTitle")}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{t("feedbackPending")}</p>
    </motion.form>
  );
}
