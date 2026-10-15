# FondUz Frontend

Responsive Next.js 15 site with Russian, English, and Uzbek locales, server-rendered content, optimized imagery, and an admin login/API proxy.

## Run locally

Install dependencies with `npm ci`, configure `API_URL` to the backend origin, provide a 32+ character `JWT_SECRET` for admin sessions, and run `npm run dev`. If API requests are restricted to the Cloudflare Worker, configure the matching server-only `CLOUDFLARE_ORIGIN_SECRET`.

Locale dictionaries live in `src/messages/{ru,en,uz}.json`; matching static copies are served from `public/messages/`. Run `npm run i18n:check` after editing translations. The hero image optimizer is `npm run images:optimize`.

## Deploy

Deploy this folder as its own Vercel project. Configure server-only `API_URL`, `JWT_SECRET`, and optional `CLOUDFLARE_ORIGIN_SECRET`. Add the resulting origin to the API's `CORS_ORIGINS`. Do not expose secrets through `NEXT_PUBLIC_*` variables or commit `.env` files.
