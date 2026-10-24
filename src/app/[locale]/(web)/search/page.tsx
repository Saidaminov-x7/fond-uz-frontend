import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Link } from "@/src/i18n/routing";
import { getDoctors, getFaqs, getNews, getPrices, getServices } from "@/src/lib/content";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };
type Result = { id: string; title: string; description: string; href: string };

function plainText(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value.join(" ") : value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ locale }, queryParams] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const query = (queryParams.q ?? "").trim().slice(0, 100);
  const [t, nav, services, doctors, news, prices, faqs] = await Promise.all([
    getTranslations({ locale, namespace: "SearchPage" }),
    getTranslations({ locale, namespace: "nav" }),
    getServices(locale), getDoctors(locale), getNews(locale), getPrices(locale), getFaqs(locale),
  ]);
  const pages: Result[] = [
    ["about", "/about"], ["services", "/services"], ["doctors", "/doctors"],
    ["prices", "/prices"], ["news", "/news"], ["faqs", "/faqs"], ["contacts", "/contacts"],
  ].map(([key, href]) => ({ id: `page-${key}`, title: nav(key), description: nav(key), href }));
  const records: Result[] = [
    ...services.map((item) => ({ id: `service-${item.slug}`, title: item.name, description: item.name, href: `/services/${encodeURIComponent(item.slug)}` })),
    ...doctors.map((item) => ({ id: `doctor-${item.id}`, title: item.name, description: item.profession, href: `/doctors/${encodeURIComponent(item.id)}` })),
    ...news.map((item) => ({ id: `news-${item.slug}`, title: item.title, description: item.subtitle, href: `/news/${encodeURIComponent(item.slug)}` })),
    ...prices.map((item) => ({ id: `price-${item.id}`, title: item.title, description: item.price, href: "/prices" })),
    ...faqs.map((item, index) => ({ id: `faq-${index}`, title: item.question, description: plainText(item.answer), href: "/faqs" })),
  ];
  const normalizedQuery = query.toLocaleLowerCase(locale);
  const results = query ? [...records, ...pages].filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase(locale).includes(normalizedQuery)).slice(0, 30) : [];

  return <div className="search-page">
    <section className="public-page-hero border-b border-border py-12 md:py-16"><Container>
      <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("hint")}</p>
      <form action="" method="get" role="search" className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="site-search-query">{t("placeholder")}</label>
        <Input id="site-search-query" name="q" type="search" maxLength={100} defaultValue={query} placeholder={t("placeholder")} className="min-h-12 h-12 min-w-0 flex-1 rounded-control" />
        <Button type="submit" size="lg" className="rounded-control">{t("submit")}</Button>
      </form>
      {query && <p className="mt-5 text-sm text-muted-foreground">{t("resultsFound", { count: results.length })} <span className="font-medium text-foreground">“{query}”</span></p>}
    </Container></section>
    {query && <Container className="search-results py-8 md:py-12">
      {results.length ? <ul className="divide-y divide-border border-y border-border">{results.map((result) => <li key={result.id}>
        <Link href={result.href} className="group flex min-h-20 items-center justify-between gap-5 py-4 text-foreground hover:text-primary">
          <span><span className="block text-lg font-semibold">{result.title}</span><span className="mt-1 block text-sm text-muted-foreground">{result.description}</span></span>
          <span aria-hidden="true" className="text-xl">{"\u2197"}</span>
        </Link>
      </li>)}</ul> : <p className="border-y border-border py-6 text-muted-foreground">{t("noResults")}</p>}
    </Container>}
  </div>;
}
