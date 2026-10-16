# FondUz public website

Responsive Next.js 15 website for the FondUz health support directory, with Russian, English, and Uzbek locales, server-rendered content, and protected admin workflows.

## Local development

```powershell
npm ci
npm run dev
```

Set server-only `API_URL` to the backend origin before starting the site. Set `NEXT_PUBLIC_API_URL` to the same origin to load public content in the browser. Set `JWT_SECRET` to the same 32+ character secret as the API for locally validated admin sessions. If the API requires the Cloudflare Worker origin header, configure the same private `CLOUDFLARE_ORIGIN_SECRET`. Never expose secrets via `NEXT_PUBLIC_*` variables.

Translations live in `src/messages/{ru,en,uz}.json`; public copies are served from `public/messages/`. Check matching locale data with `npm run i18n:check`. The hero image optimizer is `npm run images:optimize`.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
```

`npm run lint` checks UI and route modules, `npm run typecheck` checks TypeScript, and `npm run i18n:check` verifies that all three locale dictionaries remain aligned. Run the production build before publishing to catch Next.js compilation and route issues.

For browser checks, start with `npm run dev` and open `/ru`. The admin workflows are behind the existing `[locale]/admin` and `[locale]/login` routes and use the secure server-side login and API proxy.

## Deployment

Deploy this folder as the FondUz public-site project on Vercel, separate from the backend Railway service. Configure server-only `API_URL`, `JWT_SECRET`, and optional `CLOUDFLARE_ORIGIN_SECRET`; expose `NEXT_PUBLIC_API_URL` only when the public API origin is intended to be browser-readable. Add the site's exact public origin to API `CORS_ORIGINS`. Keep production and admin passwords in the hosting provider's encrypted variable store.

The public site is served at [fond-uz.vercel.app](https://fond-uz.vercel.app), with Russian, English, and Uzbek routes. The locale login page is shared with the admin authentication flow. Backend JSON content is cached briefly for public pages; edits stay behind the authenticated server-side admin proxy. Check the home page, translated routes, content detail pages, and contact submission after each frontend deployment. To confirm live content changes, edit a record in admin and verify it renders as text on the corresponding public page.
