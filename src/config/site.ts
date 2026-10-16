export const siteConfig = {
  name: "FondUz",
  description: "Tibbiy fondlar agregator platformasi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  mainNav: [
    { title: "home", href: "/" },
    { title: "about", href: "/about" },
    { title: "services", href: "/services" },
    { title: "doctors", href: "/doctors" },
    { title: "prices", href: "/prices" },
    { title: "news", href: "/news" },
    { title: "contacts", href: "/contacts" },
    { title: "faqs", href: "/faqs" },
  ],
  adminNav: [
    { title: "dashboard", href: "/admin" },
    { title: "news", href: "/admin/news" },
    { title: "faqs", href: "/admin/faqs" },
    { title: "doctors", href: "/admin/doctors" },
    { title: "prices", href: "/admin/prices" },
    { title: "services", href: "/admin/services" },
    { title: "funds", href: "/admin/funds" },
  ],
  contacts: {
    phone: "+998 71 123 45 67",
    email: "info@fond.uz",
    address: "Toshkent sh., Yunusobod tumani",
  },
  socials: {
    telegram: "https://t.me/fond_uz",
    instagram: "https://instagram.com/fond_uz",
    facebook: "https://facebook.com/fond_uz",
  }
};

export type SiteConfig = typeof siteConfig;
