import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outputDir = resolve(process.env.RESPONSIVE_QA_OUTPUT ?? "../responsive-qa-results");
const widths = [360, 390, 414, 768, 1024, 1280, 1440, 1920];
const headerWidths = [...new Set([...widths, 640, 700, 767, 1100, 1279])].sort((a, b) => a - b);
const representativeLocales = ["ru", "en", "uz"];
const routes = [
  { key: "home", path: "" },
  { key: "doctors", path: "/doctors" },
  { key: "services", path: "/services" },
  { key: "service-detail", path: "/services/qa-fixture-service" },
  { key: "prices", path: "/prices" },
  { key: "faqs", path: "/faqs" },
  { key: "news", path: "/news" },
  { key: "news-detail", path: "/news/qa-fixture-news" },
  { key: "contacts", path: "/contacts" },
  { key: "login", path: "/login" },
  { key: "admin", path: "/admin" },
];
const selectedRoutes = process.env.RESPONSIVE_QA_ROUTES
  ? routes.filter((route) => process.env.RESPONSIVE_QA_ROUTES.split(",").includes(route.key))
  : routes;

const records = {
  doctors: [{ id: "qa-doctor-1", name: "QA Sample Doctor", specialty: "QA fixture", bio: "Synthetic QA-only fixture.", email: "", phone: "", image: "/placeholders/doctor.svg" }],
  services: [{ slug: "qa-fixture-service", name: "QA Sample Service", category: "QA fixture" }],
  funds: [{ id: "qa-fund-1", professionSlug: "qa-fixture-service", name: "QA Sample Partner", phone: "0000000000", website: "", description: "Synthetic QA-only fixture." }],
  news: [{ slug: "qa-fixture-news", title: "QA Sample News", subtitle: "Synthetic QA-only fixture.", date: "2026-01-01", image: "/placeholders/news.svg", content: ["Synthetic QA-only fixture."] }],
  faqs: [{ question: "QA sample question?", answer: "Synthetic QA-only fixture." }],
  prices: [{ id: "qa-price-1", title: "QA sample entry", price: "QA fixture", includes: ["Synthetic QA-only fixture."] }],
};

const fixtureServer = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method === "OPTIONS") {
    response.writeHead(204, { "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "content-type,accept,accept-language" }).end();
    return;
  }
  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(200).end(JSON.stringify({ ok: true }));
    return;
  }
  if (request.method === "GET" && url.pathname === "/api/contacts/captcha") {
    response.writeHead(200, { "Cache-Control": "no-store" }).end(JSON.stringify({ id: randomUUID(), question: "3 + 4 = ?", expiresAt: new Date(Date.now() + 300_000).toISOString() }));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/contacts") {
    fixtureContactPosts += 1;
    response.writeHead(202).end(JSON.stringify({ ok: true, fixture: true }));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    response.writeHead(401).end(JSON.stringify({ error: "Invalid credentials" }));
    return;
  }
  if (request.method === "GET" && url.pathname === "/api/auth/session") {
    response.writeHead(401).end(JSON.stringify({ authenticated: false }));
    return;
  }
  const collection = url.pathname.match(/^\/api\/(doctors|services|funds|news|faqs|prices)$/)?.[1];
  if (request.method === "GET" && collection) {
    response.writeHead(200).end(JSON.stringify({ items: records[collection], total: records[collection].length }));
    return;
  }
  response.writeHead(404).end(JSON.stringify({ error: "Not found" }));
});

const apiPort = await new Promise((resolvePort, reject) => {
  fixtureServer.once("error", reject);
  fixtureServer.listen(0, "127.0.0.1", () => resolvePort(fixtureServer.address().port));
});
const webPort = Number(process.env.RESPONSIVE_QA_PORT ?? 3217);
const baseUrl = `http://127.0.0.1:${webPort}`;
await mkdir(outputDir, { recursive: true });
const serverLog = createWriteStream(resolve(outputDir, "next-dev.log"), { flags: "w" });
let fixtureContactPosts = 0;
const serverMode = process.env.RESPONSIVE_QA_SERVER === "start" ? "start" : "dev";

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", serverMode, "--hostname", "127.0.0.1", "--port", String(webPort)], {
  cwd: root,
  env: { ...process.env, PORT: String(webPort), API_URL: `http://127.0.0.1:${apiPort}`, NEXT_PUBLIC_API_URL: `http://127.0.0.1:${apiPort}`, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.pipe(serverLog);
server.stderr.pipe(serverLog);

let results = [];
const browser = await chromium.launch({ headless: true });
let context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
let page = await context.newPage();
const pageErrors = [];
const consoleErrors = [];
function observePage(currentPage) {
  currentPage.on("pageerror", (error) => pageErrors.push(error.message));
  currentPage.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
}
observePage(page);

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next dev exited early with ${server.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/ru`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error("Next dev server did not become ready within 60 seconds");
}

async function inspectViewport(locale, route, width) {
  const pageErrorStart = pageErrors.length;
  const consoleErrorStart = consoleErrors.length;
  await page.setViewportSize({ width, height: 1000 });
  const path = route.path ? `/${locale}${route.path}` : `/${locale}`;
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(300);
  if (route.key === "login" || route.key === "admin") {
    await page.locator('input[type="email"]').waitFor({ state: "visible", timeout: 10_000 });
    await page.waitForFunction(() => {
      const content = document.querySelector(".max-w-md");
      return Boolean(content && Number.parseFloat(getComputedStyle(content).opacity) >= 1);
    }, undefined, { timeout: 10_000 });
  }
  if (route.key === "contacts") {
    await page.waitForFunction(() => {
      const challenge = document.querySelector(".contact-captcha-question")?.textContent ?? "";
      return challenge.includes("3 + 4 = ?");
    }, undefined, { timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolveImage) => {
      image.addEventListener("load", resolveImage, { once: true });
      image.addEventListener("error", resolveImage, { once: true });
    })));
  });
  const filename = `${locale}-${route.key}-${width}.png`;
  await page.screenshot({ path: resolve(outputDir, filename), fullPage: true, caret: "initial" });
  const metrics = await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const clipping = [...document.querySelectorAll("h1,h2,h3,h4,p,a,button,label,li,summary,span")]
      .filter(visible)
      .filter((element) => {
        if (element.classList.contains("sr-only") || element.closest(".sr-only")) return false;
        const style = getComputedStyle(element);
        const clipped = ["hidden", "clip"].includes(style.overflowX) || style.textOverflow === "ellipsis" || style.whiteSpace === "nowrap";
        return clipped && element.scrollWidth > element.clientWidth + 2;
      })
      .slice(0, 20)
      .map((element) => ({ tag: element.tagName, className: String(element.className).slice(0, 100), text: element.textContent?.trim().slice(0, 80), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    const outside = [...document.querySelectorAll("body *")]
      .filter(visible)
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.right > innerWidth + 1 || rect.left < -1)
      .slice(0, 15)
      .map(({ element, rect }) => ({ tag: element.tagName, className: String(element.className).slice(0, 100), text: element.textContent?.trim().slice(0, 60), left: Math.round(rect.left), right: Math.round(rect.right) }));
    const cardSelector = ".doctor-card,.news-listing-card,.price-card,.service-result-link,.faq-item,.contact-form-card,article";
    const cards = [...document.querySelectorAll(cardSelector)].filter(visible).map((element) => element.getBoundingClientRect());
    let overlaps = 0;
    for (let i = 0; i < cards.length; i += 1) for (let j = i + 1; j < cards.length; j += 1) {
      const width = Math.min(cards[i].right, cards[j].right) - Math.max(cards[i].left, cards[j].left);
      const height = Math.min(cards[i].bottom, cards[j].bottom) - Math.max(cards[i].top, cards[j].top);
      if (width > 2 && height > 2) overlaps += 1;
    }
    const menu = document.querySelector(".site-menu-toggle");
    const nav = document.querySelector(".site-desktop-nav");
    const cssVisible = (element) => Boolean(element && getComputedStyle(element).display !== "none" && element.getClientRects().length);
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      clippedText: clipping,
      contentOutsideViewport: outside,
      overlappingCardPairs: overlaps,
      mobileMenuVisible: cssVisible(menu),
      desktopNavVisible: cssVisible(nav),
      fonts: { sans: getComputedStyle(document.body).fontFamily, serif: getComputedStyle(document.querySelector("h1") ?? document.body).fontFamily },
      visibleForms: [...document.querySelectorAll("form")].filter(visible).length,
    };
  });
  results.push({ locale, route: route.key, path: page.url(), viewport: width, status: response?.status() ?? null, screenshot: filename, metrics, pageErrors: pageErrors.slice(pageErrorStart), consoleErrors: consoleErrors.slice(consoleErrorStart) });
}

async function checkHeaderAndForms() {
  const mobileHeaderWidths = [];
  const desktopHeaderWidths = [];
  for (const width of headerWidths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseUrl}/ru`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    if (width <= 1023) {
      const menuButton = page.locator(".site-menu-toggle");
      await menuButton.waitFor({ state: "visible", timeout: 15_000 });
      if (!(await menuButton.isVisible())) throw new Error(`Burger menu is not visible at ${width}px`);
      await menuButton.click();
      try {
        await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.hasAttribute("hidden") === false, undefined, { timeout: 5_000 });
      } catch {
        await menuButton.click();
        await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.hasAttribute("hidden") === false, undefined, { timeout: 5_000 });
      }
      if (!(await page.locator("#mobile-navigation[role=dialog]").isVisible())) throw new Error(`Mobile drawer did not open at ${width}px`);
      const searchToggle = page.locator(".site-mobile-search-toggle").first();
      if (await searchToggle.isVisible()) {
        await searchToggle.click();
        if (!(await page.locator(".mobile-search-form input").isVisible())) throw new Error(`Mobile search did not open at ${width}px`);
      }
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.hasAttribute("hidden") === true, undefined, { timeout: 5_000 });
      if (await page.locator("#mobile-navigation[role=dialog]").isVisible()) throw new Error(`Escape did not close the mobile drawer at ${width}px`);
      mobileHeaderWidths.push(width);
    } else {
      await page.locator(".site-desktop-nav").waitFor({ state: "visible", timeout: 15_000 });
      if (!(await page.locator(".site-desktop-nav").isVisible())) throw new Error(`Desktop navigation is not visible at ${width}px`);
      const searchButton = page.locator('button[aria-controls="site-search-desktop"]');
      await searchButton.click();
      await page.waitForTimeout(200);
      if (await searchButton.getAttribute("aria-expanded") !== "true") await searchButton.click();
      await page.waitForFunction(() => document.querySelector('button[aria-controls="site-search-desktop"]')?.getAttribute("aria-expanded") === "true", undefined, { timeout: 5_000 });
      await page.locator("#site-search-desktop input").waitFor({ state: "visible", timeout: 5_000 });
      if (!(await page.locator("#site-search-desktop input").isVisible())) throw new Error(`Desktop search did not open at ${width}px`);
      desktopHeaderWidths.push(width);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/ru/contacts`, { waitUntil: "domcontentloaded" });
  await page.locator("#contact-name").fill("QA Sample Visitor");
  await page.locator("#contact-reply-to").fill("qa@example.test");
  await page.locator("#contact-message").fill("Synthetic local QA submission.");
  await page.locator("#contact-captcha-answer").fill("7");
  await page.locator("input[name=consent]").check();
  const contactSubmit = page.locator(".contact-form button[type=submit]");
  if (!(await contactSubmit.isEnabled())) throw new Error("Contact form submit is disabled with local CAPTCHA fixture");
  const [contactResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/api/contacts") && response.request().method() === "POST"),
    contactSubmit.click(),
  ]);
  if (contactResponse.status() !== 202) throw new Error(`Synthetic local contact form returned ${contactResponse.status()}`);
  if (fixtureContactPosts !== 1) throw new Error(`Expected one synthetic local contact POST, got ${fixtureContactPosts}`);

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${baseUrl}/ru/login`, { waitUntil: "domcontentloaded" });
  await page.locator("input[type=email]").fill("qa.invalid@example.test");
  await page.locator("input[type=password]").fill("not-a-real-password");
  await page.locator("form button[type=submit]").click();
  await page.locator("main [role=alert]").waitFor({ timeout: 10_000 });
  await page.goto(`${baseUrl}/ru/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const adminGate = { url: page.url(), loginFormVisible: await page.locator("input[type=email]").isVisible().catch(() => false) };
  return {
    mobileHeaderWidths,
    desktopHeaderWidths,
    contactForm: { httpStatus: contactResponse.status(), syntheticPosts: fixtureContactPosts },
    loginInvalidCredentials: "application alert appeared after synthetic local 401 response",
    adminUnauthenticatedAccess: adminGate,
  };
}

try {
  await mkdir(outputDir, { recursive: true });
  await waitForServer();
  if (process.env.RESPONSIVE_QA_REUSE_MATRIX === "1") {
    const previous = JSON.parse(await readFile(resolve(outputDir, "responsive-qa-progress.json"), "utf8"));
    const expectedKeys = new Set(representativeLocales.flatMap((locale) => routes.flatMap((route) => widths.map((width) => `${locale}/${route.key}/${width}`))));
    const actualKeys = new Set(previous.results?.map((result) => `${result.locale}/${result.route}/${result.viewport}`) ?? []);
    if (previous.results?.length !== 264 || actualKeys.size !== 264 || [...expectedKeys].some((key) => !actualKeys.has(key)) || previous.results.some((result) => result.status !== 200 || !widths.includes(result.viewport) || !representativeLocales.includes(result.locale) || !routes.some((route) => route.key === result.route))) {
      throw new Error("Refusing to reuse a stale or incomplete screenshot matrix; expected 264 route/locale/viewport records");
    }
    for (const result of previous.results) await readFile(resolve(outputDir, result.screenshot));
    results = previous.results;
  } else if (process.env.RESPONSIVE_QA_RESUME_MATRIX === "1") {
    const previous = JSON.parse(await readFile(resolve(outputDir, "responsive-qa-progress.json"), "utf8"));
    const keys = new Set();
    const expectedKeys = new Set(representativeLocales.flatMap((locale) => routes.flatMap((route) => widths.map((width) => `${locale}/${route.key}/${width}`))));
    for (const result of previous.results ?? []) {
      const key = `${result.locale}/${result.route}/${result.viewport}`;
      if (keys.has(key) || !expectedKeys.has(key) || result.status !== 200 || result.pageErrors?.length || result.consoleErrors?.length || result.metrics?.horizontalOverflow || result.metrics?.clippedText?.length || result.metrics?.contentOutsideViewport?.length || result.metrics?.overlappingCardPairs) throw new Error(`Invalid existing QA progress record: ${key}`);
      await readFile(resolve(outputDir, result.screenshot));
      keys.add(key);
    }
    results = previous.results;
  }
  if (process.env.RESPONSIVE_QA_REUSE_MATRIX !== "1") {
    const completed = new Set(results.map((result) => `${result.locale}/${result.route}/${result.viewport}`));
    for (const locale of representativeLocales) {
      const localeWidths = widths;
      for (const route of selectedRoutes) {
        for (const width of localeWidths) {
          if (!completed.has(`${locale}/${route.key}/${width}`)) await inspectViewport(locale, route, width);
        }
        await writeFile(resolve(outputDir, "responsive-qa-progress.json"), JSON.stringify({ generatedAt: new Date().toISOString(), locale, route: route.key, completed: results.length, results }, null, 2));
      }
      if (locale !== representativeLocales.at(-1)) {
        await context.close();
        context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
        page = await context.newPage();
        observePage(page);
      }
    }
  }
  const interactions = await checkHeaderAndForms();
  const report = {
    generatedAt: new Date().toISOString(),
    origin: baseUrl,
    fixtureData: "Synthetic local-only QA records; no production API or real data used.",
    routeCount: selectedRoutes.length,
    screenshots: results.length,
    widths: { ru: widths, en: widths, uz: widths },
    interactions,
    results,
  };
  await writeFile(resolve(outputDir, "responsive-qa.json"), JSON.stringify(report, null, 2));
  const failures = results.filter((result) => result.status !== 200 || result.metrics.horizontalOverflow || result.metrics.clippedText.length || result.metrics.contentOutsideViewport.length || result.metrics.overlappingCardPairs || result.pageErrors.length || result.consoleErrors.length);
  console.log(JSON.stringify({ outputDir, screenshots: results.length, failureCount: failures.length, failures: failures.map(({ locale, route, viewport, status, metrics, pageErrors }) => ({ locale, route, viewport, status, horizontalOverflow: metrics.horizontalOverflow, clippedText: metrics.clippedText.length, outside: metrics.contentOutsideViewport.length, overlaps: metrics.overlappingCardPairs, pageErrors })) }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolveClose) => fixtureServer.close(resolveClose));
  server.kill("SIGTERM");
  await new Promise((resolveClose) => setTimeout(resolveClose, 300));
  if (server.exitCode === null) server.kill("SIGKILL");
  serverLog.end();
}
