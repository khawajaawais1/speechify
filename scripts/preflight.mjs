/**
 * Production pre-flight.
 *
 *   npm run preflight
 *
 * Checks the things that are invisible in development and expensive in
 * production: images still hosted on someone else's domain, a missing Stripe
 * key, an unset site URL, oversized files in public/, and translation drift.
 *
 * Exits non-zero on a FAIL so it can gate a deploy. Warnings do not block.
 *
 * No dependencies — plain Node 18+.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

let fails = 0;
let warns = 0;
const pass = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const warn = (m) => { warns++; console.log(`  \x1b[33m!\x1b[0m ${m}`); };
const fail = (m) => { fails++; console.log(`  \x1b[31m✗\x1b[0m ${m}`); };

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

console.log("\nPasargad — production pre-flight\n");

/* ── 1. No images loaded from domains we do not control ─────────────── */
console.log("Images");
{
  const src = walk(join(root, "src"))
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => read(relative(root, f)))
    .join("\n");

  const remote = [...src.matchAll(/https:\/\/(pasargadseppala\.fi|[a-z0-9]+\.cloudfront\.net)[^"'\s)]*/g)];
  if (remote.length) {
    const hosts = [...new Set(remote.map((m) => m[1]))];
    fail(
      `${remote.length} image(s) still load from ${hosts.join(", ")}. ` +
        `Run \`npm run images:local\`, paste the block it prints into src/data/site.ts, ` +
        `then delete those hosts from images.remotePatterns in next.config.ts.`,
    );
  } else {
    pass("every image is served from this site");
  }

  const cfg = read("next.config.ts");
  for (const host of ["pasargadseppala.fi", "cloudfront.net"]) {
    if (cfg.includes(host) && !remote.length) {
      warn(`next.config.ts still allows ${host} in remotePatterns — it is unused, remove it`);
    }
  }
}

/* ── 2. Nothing oversized in public/ ────────────────────────────────── */
{
  const LIMIT = 1_200_000; // 2000px @ q82 lands around 500 KB
  const big = walk(join(root, "public"))
    .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(extname(f)))
    .map((f) => [relative(root, f), statSync(f).size])
    .filter(([, s]) => s > LIMIT)
    .sort((a, b) => b[1] - a[1]);

  if (big.length) {
    warn(`${big.length} image(s) over ${(LIMIT / 1e6).toFixed(1)} MB — resize to 2000px @ q82:`);
    for (const [f, s] of big.slice(0, 10)) console.log(`      ${(s / 1e6).toFixed(1)} MB  ${f}`);
  } else {
    pass("no oversized files in public/");
  }

  // Every /menu path referenced in code must exist on disk.
  const src = walk(join(root, "src"))
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => read(relative(root, f)))
    .join("\n");
  const refs = [...new Set([...src.matchAll(/["'](\/(?:menu|photos|hero|brand)\/[^"']+)["']/g)].map((m) => m[1]))];
  const missing = refs.filter((r) => !existsSync(join(root, "public", r)));
  if (missing.length) fail(`missing file(s) in public/: ${missing.join(", ")}`);
  else pass(`all ${refs.length} local asset paths resolve`);
}

/* ── 3. Environment ─────────────────────────────────────────────────── */
console.log("\nEnvironment");
{
  const envFiles = [".env.local", ".env.production", ".env"].filter((f) => existsSync(join(root, f)));
  const env = envFiles.map((f) => read(f)).join("\n");
  const has = (k) => new RegExp(`^\\s*${k}\\s*=\\s*\\S`, "m").test(env) || !!process.env[k];

  if (has("STRIPE_SECRET_KEY")) {
    const live = /STRIPE_SECRET_KEY\s*=\s*sk_live/.test(env) || /^sk_live/.test(process.env.STRIPE_SECRET_KEY ?? "");
    pass(`STRIPE_SECRET_KEY is set (${live ? "live" : "test"} mode)`);
    if (!live) warn("Stripe is in TEST mode — real cards will be declined");
  } else {
    fail("STRIPE_SECRET_KEY is not set. Online ordering returns 503 until it is.");
  }

  if (has("NEXT_PUBLIC_SITE_URL")) pass("NEXT_PUBLIC_SITE_URL is set");
  else
    fail(
      "NEXT_PUBLIC_SITE_URL is not set. Canonical URLs, the sitemap and Stripe's " +
        "return URLs all fall back to a guess, and the checkout route then trusts " +
        "the request's Origin header.",
    );
}

/* ── 4. Translations ────────────────────────────────────────────────── */
console.log("\nTranslations");
{
  const s = read("src/lib/i18n.ts");
  const grab = (name) => {
    const i = s.indexOf(`const ${name}: Dict = {`);
    return [...s.slice(i, s.indexOf("\n};", i)).matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]);
  };
  const en = grab("en");
  const fi = grab("fi");
  const E = new Set(en);
  const F = new Set(fi);
  const onlyEn = en.filter((k) => !F.has(k));
  const onlyFi = fi.filter((k) => !E.has(k));

  if (onlyEn.length) fail(`missing Finnish: ${onlyEn.join(", ")}`);
  if (onlyFi.length) fail(`missing English: ${onlyFi.join(", ")}`);
  if (!onlyEn.length && !onlyFi.length) pass(`both dictionaries carry the same ${en.length} keys`);

  // Any t("…") in the app that has no entry renders the raw key to the customer.
  const used = new Set();
  for (const f of walk(join(root, "src")).filter((f) => /\.tsx?$/.test(f) && !f.endsWith("i18n.ts")))
    for (const m of read(relative(root, f)).matchAll(/\bt\(\s*"([^"]+)"/g)) used.add(m[1]);
  const unknown = [...used].filter((k) => !E.has(k));
  if (unknown.length) fail(`t() called with undefined key(s): ${unknown.join(", ")}`);
  else pass(`all ${used.size} t() keys resolve`);
}

/* ── 5. Catalogue sanity ────────────────────────────────────────────── */
console.log("\nCatalogue");
{
  const s = read("src/data/products.ts");
  const rows = [...s.matchAll(/^\s*P\(\{ id: "([^"]+)".*$/gm)];
  const ids = rows.map((r) => r[1]);
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dupes.length) fail(`duplicate product id(s): ${[...new Set(dupes)].join(", ")}`);
  else pass(`${ids.length} products, all ids unique`);

  const bad = [];
  const noImg = [];
  for (const r of rows) {
    const price = parseFloat(r[0].match(/price: ([\d.]+)/)?.[1] ?? "0");
    const offer = r[0].match(/offer: ([\d.]+)/);
    if (!r[0].includes("img:")) noImg.push(r[1]);
    if (offer && parseFloat(offer[1]) >= price) bad.push(`${r[1]} (offer ${offer[1]} >= price ${price})`);
    if (!price) bad.push(`${r[1]} (no price)`);
  }
  if (bad.length) fail(`price problems: ${bad.join(", ")}`);
  else pass("every product has a price, and no discount is >= its list price");
  if (noImg.length) warn(`${noImg.length} product(s) show a fallback tile: ${noImg.join(", ")}`);
  else pass("every product has a photo");
}

/* ── Result ─────────────────────────────────────────────────────────── */
console.log(
  fails
    ? `\n\x1b[31m${fails} blocker(s)\x1b[0m${warns ? `, ${warns} warning(s)` : ""} — not ready to deploy.\n`
    : warns
      ? `\n\x1b[33mReady, with ${warns} warning(s).\x1b[0m\n`
      : "\n\x1b[32mReady for production.\x1b[0m\n",
);
process.exit(fails ? 1 : 0);
