"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

type SubmitState = "idle" | "sending" | "success" | "error" | "rate-limit";

export function ContactForm() {
  const t = useTranslations("contacts");
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const contact = String(formData.get("contact") ?? "").trim();
    const isEmail = contact.includes("@");
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          ...(isEmail ? { email: contact } : { phone: contact }),
          message: formData.get("message"),
          consent: formData.get("consent") === "on",
        }),
      });
      if (response.status === 429) {
        setState("rate-limit");
        return;
      }
      if (!response.ok) {
        setState("error");
        return;
      }
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{t("feedbackTitle")}</h2>
      <p className="contact-form-intro">{t("formIntro")}</p>

      <label className="contact-field">
        <span>{t("nameLabel")} <span aria-hidden="true">*</span></span>
        <input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder={t("namePlaceholder")} />
      </label>

      <label className="contact-field">
        <span>{t("replyContactLabel")} <span aria-hidden="true">*</span></span>
        <input name="contact" type="text" autoComplete="on" required maxLength={254} placeholder={t("replyContactPlaceholder")} />
        <span className="contact-field-note">{t("replyContactHint")}</span>
      </label>

      <label className="contact-field">
        <span>{t("messageLabel")} <span aria-hidden="true">*</span></span>
        <textarea name="message" required minLength={5} maxLength={3000} rows={5} placeholder={t("messagePlaceholder")} />
      </label>

      <label className="contact-consent">
        <input type="checkbox" name="consent" required />
        <span>{t("consentText")} <Link href="/privacy-policy">{t("privacyLink")}</Link></span>
      </label>

      <p className="contact-form-note">{t("privacyNote")}</p>
      <button className="contact-submit" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t("sending") : t("submit")}
      </button>
      {state === "success" ? <p className="contact-feedback success" role="status">{t("submitSuccess")}</p> : null}
      {state === "rate-limit" ? <p className="contact-feedback error" role="alert">{t("rateLimitMessage")}</p> : null}
      {state === "error" ? <p className="contact-feedback error" role="alert">{t("submitError")}</p> : null}
    </form>
  );
}
