"use client";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Card } from "@/src/components/ui/Card";
import { StatusAlert } from "@/src/components/ui/StatusAlert";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error" | "rate-limit" | "captcha-invalid";
type Challenge = { id: string; question: string; expiresAt: string };
type ChallengeState = "loading" | "ready" | "error";

export function ContactForm() {
  const t = useTranslations("contacts");
  const locale = useLocale();
  const [state, setState] = useState<SubmitState>("idle");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeState, setChallengeState] = useState<ChallengeState>("loading");

  const loadChallenge = useCallback(async () => {
    setChallengeState("loading");
    setChallenge(null);
    try {
      const response = await fetch("/api/contacts/captcha", { headers: { Accept: "application/json", "Accept-Language": locale }, cache: "no-store" });
      if (!response.ok) throw new Error("CAPTCHA_UNAVAILABLE");
      const result = await response.json() as Partial<Challenge>;
      if (typeof result.id !== "string" || typeof result.question !== "string" || typeof result.expiresAt !== "string") {
        throw new Error("CAPTCHA_RESPONSE_INVALID");
      }
      setChallenge(result as Challenge);
      setChallengeState("ready");
    } catch {
      setChallengeState("error");
    }
  }, [locale]);

  useEffect(() => { void loadChallenge(); }, [loadChallenge]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || challengeState !== "ready") return;
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
          captchaId: challenge.id,
          captchaAnswer: String(formData.get("captchaAnswer") ?? "").trim(),
        }),
      });
      if (response.status === 429) {
        setState("rate-limit");
        return;
      }
      if (response.status === 400) {
        const result = await response.clone().json().catch(() => null) as { error?: string } | null;
        if (result?.error === "CAPTCHA_INVALID") {
          setState("captcha-invalid");
          await loadChallenge();
          return;
        }
      }
      if (!response.ok) {
        setState("error");
        return;
      }
      form.reset();
      setState("success");
      await loadChallenge();
    } catch {
      setState("error");
    }
  }

  const busy = state === "sending";
  const captchaDisabled = challengeState !== "ready" || !challenge;

  return (
    <Card className="contact-form-card">
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{t("feedbackTitle")}</h2>
      <p className="contact-form-intro">{t("formIntro")}</p>

      <label className="contact-field" htmlFor="contact-name">
        <span>{t("nameLabel")} <span aria-hidden="true">*</span></span>
        <Input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder={t("namePlaceholder")} />
      </label>

      <label className="contact-field" htmlFor="contact-reply-to">
        <span>{t("replyContactLabel")} <span aria-hidden="true">*</span></span>
        <Input id="contact-reply-to" name="contact" type="text" autoComplete="on" required maxLength={254} placeholder={t("replyContactPlaceholder")} />
        <span className="contact-field-note">{t("replyContactHint")}</span>
      </label>

      <label className="contact-field" htmlFor="contact-message">
        <span>{t("messageLabel")} <span aria-hidden="true">*</span></span>
        <Textarea id="contact-message" name="message" required minLength={5} maxLength={3000} rows={5} placeholder={t("messagePlaceholder")} />
      </label>

      <fieldset className="contact-captcha" aria-describedby="contact-captcha-description">
        <legend>{t("captchaLabel")} <span aria-hidden="true">*</span></legend>
        {challengeState === "ready" && challenge ? (
          <>
            <p className="contact-captcha-question" aria-live="polite">{challenge.question}</p>
            <p className="contact-field-note" id="contact-captcha-description">{t("captchaInstructions")}</p>
            <div className="contact-captcha-controls">
              <label className="sr-only" htmlFor="contact-captcha-answer">{t("captchaAnswerLabel")}</label>
              <Input id="contact-captcha-answer" name="captchaAnswer" type="text" inputMode="numeric" autoComplete="off" required disabled={busy} maxLength={8} aria-describedby="contact-captcha-description" placeholder={t("captchaAnswerPlaceholder")} />
              <Button type="button" variant="secondary" onClick={() => { setState("idle"); void loadChallenge(); }} disabled={busy}>{t("captchaRefresh")}</Button>
            </div>
          </>
        ) : (
          <div className="contact-captcha-controls">
            <p className="contact-field-note" id="contact-captcha-description" role={challengeState === "error" ? "alert" : "status"}>
              {challengeState === "loading" ? t("captchaLoading") : t("captchaUnavailable")}
            </p>
            {challengeState === "error" ? <Button type="button" variant="secondary" onClick={() => void loadChallenge()}>{t("captchaRetry")}</Button> : null}
          </div>
        )}
      </fieldset>
      {state === "captcha-invalid" ? <StatusAlert tone="error">{t("captchaInvalid")}</StatusAlert> : null}

      <label className="contact-consent">
        <input type="checkbox" name="consent" required />
        <span>{t("consentText")} <Link href="/privacy-policy">{t("privacyLink")}</Link></span>
      </label>

      <p className="contact-form-note">{t("privacyNote")}</p>
      <Button className="contact-submit" type="submit" isLoading={busy} disabled={busy || captchaDisabled}>
        {busy ? t("sending") : t("submit")}
      </Button>
      <div aria-live="polite" className="sr-only">
        {challengeState === "ready" ? t("captchaReady") : ""}
      </div>
      {state === "success" ? <StatusAlert tone="success">{t("submitSuccess")}</StatusAlert> : null}
      {state === "rate-limit" ? <StatusAlert tone="error">{t("rateLimitMessage")}</StatusAlert> : null}
      {state === "error" ? <StatusAlert tone="error">{t("submitError")}</StatusAlert> : null}
    </form>
    </Card>
  );
}
