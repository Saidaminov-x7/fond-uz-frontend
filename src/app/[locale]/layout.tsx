import "@/src/styles/globals.css";
import { AppProviders } from "@/src/components/providers/AppProviders";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Fraunces } from "next/font/google";
import { routing } from "@/src/i18n/routing";
import { headers } from "next/headers";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders nonce={nonce}>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
