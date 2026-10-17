"use client";

import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { motion } from "framer-motion";

const locales = ["ru", "en", "uz"] as const;

export default function LoginPage() {
  const t = useTranslations("Auth");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextLocale = locales[(locales.indexOf(locale as typeof locales[number]) + 1) % locales.length];
  const switchLanguage = () => router.replace(pathname, { locale: nextLocale });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        if (!sessionResponse.ok) {
          setError(t("loginError"));
          return;
        }
        router.replace("/admin");
        router.refresh();
      } else if (response.headers.get("content-type")?.includes("application/json")) {
        const data = await response.json();
        setError(data.error || t("loginError"));
      } else {
        setError(t("loginError"));
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-background">
    <Container className="flex min-h-screen max-w-6xl items-center py-8 sm:py-12">
      <div className="grid w-full overflow-hidden border border-border bg-card md:grid-cols-[.9fr_1.1fr]">
        <section className="relative flex min-h-52 flex-col justify-between bg-primary p-7 text-primary-foreground sm:p-10 md:min-h-[34rem]">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center border border-primary-foreground/35 font-serif text-xl">F</span><span className="font-semibold tracking-tight">FondUz</span></div>
          <div className="relative z-10 mt-12 max-w-sm md:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-primary-foreground/70">FondUz</p>
            <h1 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{t("login")}</h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/80">{t("subTitle")}</p>
          </div>
          <p className="mt-9 text-[10px] font-medium tracking-[.14em] text-primary-foreground/60">CONTENT MANAGEMENT</p>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 select-none font-serif text-[14rem] leading-[.8] text-white/[.06]">F</span>
        </section>

        <section className="flex flex-col justify-center p-6 sm:p-10 md:p-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }} className="mx-auto w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-primary">{t("secureAccess")}</p>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">{t("login")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("formDescription")}</p>

            {error && <div role="alert" aria-live="polite" className="mt-6 border-l-[3px] border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="grid gap-2 text-sm font-medium text-foreground"><span>{t("email")}</span>
                <input type="email" autoComplete="username" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="h-12 w-full rounded-none border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground"><span>{t("password")}</span>
                <input type="password" autoComplete="current-password" required value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="h-12 w-full rounded-none border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </label>
              <Button type="submit" variant="primary" className="h-12 w-full rounded-none font-semibold" disabled={loading}>{loading ? t("submitting") : t("submit")}</Button>
            </form>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <button type="button" onClick={switchLanguage} className="inline-flex min-h-10 items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-foreground hover:text-primary" aria-label={`${t("language")}: ${nextLocale.toUpperCase()}`}>
                {locale.toUpperCase()} <span aria-hidden="true">→ {nextLocale.toUpperCase()}</span>
              </button>
              <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">{tc("theme")}</span><ThemeToggle /></div>
            </div>
          </motion.div>
        </section>
      </div>
    </Container>
  </main>;
}
