"use client";

import { ReactNode, useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { siteConfig } from "@/src/config/site";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { Container } from "@/src/components/ui/Container";
import { useLocale } from "next-intl";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/session", { cache: "no-store" }).then((response) => {
      if (!active) return;
      if (response.ok) setIsReady(true);
      else router.replace("/login");
    }).catch(() => router.replace("/login"));
    return () => { active = false; };
  }, [router]);

  const toggleLanguage = () => {
    const nextLocale = locale === "uz" ? "ru" : "uz";
    router.replace(pathname, { locale: nextLocale });
  };

  const handleLogout = () => {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => router.push("/login"));
  };

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="font-serif text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            FondUz Admin
          </Link>
        </div>
        <nav className="space-y-1.5 p-4">
          {siteConfig.adminNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card px-8">
          <div className="flex flex-1 items-center justify-between">
            <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              {pathname.split("/").pop()?.toUpperCase() || "DASHBOARD"}
            </h2>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={toggleLanguage}
              className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-bold uppercase text-foreground hover:bg-muted transition-colors"
              >
                {locale}
              </button>
              <ThemeToggle />
              <button 
                onClick={handleLogout}
                className="rounded-md border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-tight transition-colors hover:border-red-600 hover:bg-red-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Container className="max-w-7xl">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}
