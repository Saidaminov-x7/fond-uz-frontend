import { Container } from "@/src/components/ui/Container";
import { Link } from "@/src/i18n/routing";
import { getDoctors, getPrices, getServices } from "@/src/lib/content";
import { getTranslations } from "next-intl/server";

export async function HomeContentSections({ locale }: { locale: string }) {
  const [services, doctors, prices, home, nav] = await Promise.all([
    getServices(locale), getDoctors(locale), getPrices(locale),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  return <>
    <section className="home-content-section py-12 md:py-16"><Container>
      <div className="home-about-grid">
        <div><p className="section-kicker">{home("aboutKicker")}</p><h2>{nav("about")}</h2></div>
        <div><h3>{home("aboutPreviewTitle")}</h3><p className="home-about-copy">{home("aboutPreviewBody")}</p><Link className="home-text-link" href="/about">{home("aboutMore")} <span aria-hidden="true">{"\u2197"}</span></Link></div>
      </div>
    </Container></section>
    <section className="home-content-section home-content-muted py-12 md:py-16"><Container>
      <div className="section-heading"><div><p className="section-kicker">{home("servicesKicker")}</p><h2>{nav("services")}</h2></div><Link className="home-text-link" href="/services">{home("viewAllServices")} <span aria-hidden="true">{"\u2197"}</span></Link></div>
      {services.length > 0 ? <div className="home-data-grid">{services.slice(0, 3).map((item) => <Link className="home-data-card" href={`/services/${item.slug}`} key={item.slug}><span>{item.name}</span><span aria-hidden="true">{"\u2197"}</span></Link>)}</div> : <p className="empty-state">{home("emptyServiceText")}</p>}
    </Container></section>
    <section className="home-content-section py-12 md:py-16"><Container>
      <div className="section-heading"><div><p className="section-kicker">{home("doctorsKicker")}</p><h2>{nav("doctors")}</h2></div><Link className="home-text-link" href="/doctors">{home("viewAllDoctors")} <span aria-hidden="true">{"\u2197"}</span></Link></div>
      {doctors.length > 0 ? <div className="home-data-grid">{doctors.slice(0, 3).map((item) => <Link className="home-data-card home-doctor-card" href={`/doctors/${item.id}`} key={item.id}><span>{item.name}</span><small>{item.profession}</small></Link>)}</div> : <p className="empty-state">{home("doctorsIntro")}</p>}
    </Container></section>
    <section className="home-content-section home-content-muted py-12 md:py-16"><Container>
      <div className="section-heading"><div><p className="section-kicker">{home("pricesKicker")}</p><h2>{nav("prices")}</h2></div><Link className="home-text-link" href="/prices">{home("viewAllPrices")} <span aria-hidden="true">{"\u2197"}</span></Link></div>
      {prices.length > 0 ? <div className="home-price-table-wrap"><table className="home-price-table"><thead><tr><th>{home("priceName")}</th><th>{home("priceValue")}</th></tr></thead><tbody>{prices.slice(0, 5).map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.price}</td></tr>)}</tbody></table></div> : <p className="empty-state">{home("pricesIntro")}</p>}
    </Container></section>
  </>;
}
