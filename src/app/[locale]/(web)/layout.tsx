import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import type { ReactNode } from "react";

import { setRequestLocale } from "next-intl/server";

export default async function WebLayout({ children, params }: { children: ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="public-site flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
