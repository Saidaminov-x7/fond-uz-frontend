import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const languages = ["ru", "en", "uz"];
const apps = [
  { name: "frontend", root: resolve(process.cwd()) },
  { name: "admin", root: resolve(process.cwd(), "../fond-uz-admin-panel") },
];
let failures = 0;

function flatten(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child) ? flatten(child, path) : [path];
  });
}

function allStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

for (const app of apps) {
  const sourceDir = resolve(app.root, "src/messages");
  const publicDir = resolve(app.root, "public/messages");
  const messages = {};
  for (const locale of languages) {
    try { messages[locale] = JSON.parse(await readFile(resolve(sourceDir, `${locale}.json`), "utf8")); }
    catch (error) { console.error(`${app.name}/${locale}: ${error.message}`); failures++; continue; }
  }
  if (languages.some((locale) => !messages[locale])) continue;
  const referenceKeys = flatten(messages.ru).sort();
  for (const locale of ["en", "uz"]) {
    const keys = flatten(messages[locale]).sort();
    const missing = referenceKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !referenceKeys.includes(key));
    if (missing.length || extra.length) { console.error(`${app.name}/${locale}: missing=${missing.join(",")} extra=${extra.join(",")}`); failures++; }
  }
  for (const locale of languages) {
    const bad = allStrings(messages[locale]).filter((value) => value.includes("\uFFFD") || /[\u0080-\u009F]/.test(value) || /Р[џѕ„”°±‘’–љњѓ¤¦§®©]/u.test(value));
    if (bad.length) { console.error(`${app.name}/${locale}: ${bad.length} malformed/garbled translation strings`); failures++; }
    const sourceText = `${JSON.stringify(messages[locale], null, 2)}\n`;
    const publicPath = resolve(publicDir, `${locale}.json`);
    let publicText;
    try { publicText = await readFile(publicPath, "utf8"); }
    catch { publicText = null; }
    if (publicText !== sourceText) {
      if (process.argv.includes("--sync-public")) await writeFile(publicPath, sourceText, "utf8");
      else { console.error(`${app.name}/${locale}: public/messages copy is missing or stale`); failures++; }
    }
  }
}

if (failures) process.exitCode = 1;
else console.log("I18N_AUDIT_PASSED: ru/en/uz dictionaries are valid, complete, and publicly mirrored");
