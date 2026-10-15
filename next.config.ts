import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  `./src/i18n/request.ts`
)

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
      ],
    }];
  },
  async redirects() {
    return [
      { source: "/:locale/home", destination: "/:locale", permanent: true },
      { source: "/:locale/about-us", destination: "/:locale/about", permanent: true },
      { source: "/:locale/blog", destination: "/:locale/news", permanent: true },
      { source: "/:locale/faq", destination: "/:locale/faqs", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
