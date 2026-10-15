"use client";

import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { motion } from "framer-motion";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleLanguage = () => {
    const nextLocale = locale === "uz" ? "ru" : "uz";
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok) {
        // Success! Redirect to admin dashboard
        router.push("/admin");
      } else if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setError(data.error || "Login failed");
      } else {
        setError(`Server error: ${res.status}`);
      }
    } catch {
      setError("Network error: Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center py-12">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md overflow-hidden rounded-3xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl"
        >
          <div className="bg-primary/5 p-8 text-center transition-colors">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("login")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Admin-panel login</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 rounded-2xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-500 ring-1 ring-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {t("email")}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 w-full rounded-2xl border border-border/50 bg-background/50 px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  placeholder="admin@fond.uz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {t("password")}
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 w-full rounded-2xl border border-border/50 bg-background/50 px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="h-12 w-full rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? "..." : t("submit")}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-between border-t border-border/30 pt-6">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex h-10 items-center justify-center rounded-2xl border border-border/50 bg-background/50 px-4 text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted transition-all"
              >
                {locale}
              </button>

              <div className="flex h-10 items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-3">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                  {tc("themeLight")} / {tc("themeDark")}
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
