/**
 * Download every remote image into public/ and print the code to paste back.
 *
 *   node scripts/fetch-images.mjs
 *
 * Right now the site loads photos from two places it does not own:
 *   • pasargadseppala.fi  — the restaurant's WordPress media library
 *   • the Higgsfield CDN  — the generated dish and fire-sequence images
 *
 * Both are fine while reviewing, but neither is a URL you control. If the old
 * WordPress site is taken down, or the generation CDN expires a file, images
 * start 404-ing in production. This pulls them all local.
 *
 * After running it, paste the block it prints over PHOTOS / GEN / FIRE_FRAMES
 * in src/data/site.ts, then delete the two remote entries from
 * `images.remotePatterns` in next.config.ts.
 *
 * No dependencies — plain Node 18+.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Everything referenced by src/data/site.ts, grouped by destination folder. */
const GROUPS = {
  // key -> remote URL
  photos: {
    hero: "https://pasargadseppala.fi/wp-content/uploads/2025/02/20241024_104254.jpg",
    interior1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1554-min.jpg",
    interior2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1470-min.jpg",
    interior3: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1454-min.jpg",
    food1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1503-min.jpg",
    food2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1500-min.jpg",
    food3: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1539-min.jpg",
    food4: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1546-min.jpg",
    food5: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1523-min.jpg",
    food6: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1478-min.jpg",
    food7: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1441-min.jpg",
    food8: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1464-min.jpg",
    food9: "https://pasargadseppala.fi/wp-content/uploads/2024/09/DSC1486-min.jpg",
    buffet1: "https://pasargadseppala.fi/wp-content/uploads/2024/09/IMG-20240910-WA0032.jpg",
    buffet2: "https://pasargadseppala.fi/wp-content/uploads/2024/09/IMG-20240910-WA0022.jpg",
  },
  menu: {
    laalMaas:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_76bb5a00-d412-46d4-b214-21da795b2ace.png",
    kozhiVartha:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_d1314cc6-753c-4e83-ab69-728836c40ca1.png",
    beefVindaloo:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_192513_b2487db4-affb-47ac-9ba3-14cb2b0ea649.png",
    lambTikkaMasala:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_191215_04c107b2-291b-4b89-b42d-257dfe31b41e.png",
    murghMakhni:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_1409c12e-43ee-4ef0-aac4-a95c86f28085.png",
    pizzaClassic:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_e2a2e05f-fe3e-4d9a-8afb-f484adfa4e9d.png",
    pizzaVegan:
      "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_190453_c3ae9b59-382c-4cae-b549-a2f1a3c0f98f.png",
  },
  hero: {
    "1": "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_7fb7a63b-7fa7-4a32-9a0b-6a71227f08e0.png",
    "2": "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_ecccbf2a-2a6d-40cc-861d-e896ec219f91.png",
    "3": "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_6d71947a-6314-4f4c-8f21-76ba9009c5c0.png",
    "4": "https://d8j0ntlcm91z4.cloudfront.net/user_36lMU25ignlIHCJiVJMiNFl75ho/hf_20260830_183649_5ae0730e-29b3-467c-9971-b91e5a3a8693.png",
  },
};

const ext = (url) => (url.split("?")[0].match(/\.(jpe?g|png|webp|avif)$/i)?.[1] ?? "jpg").toLowerCase();

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return (await res.headers.get("content-length")) ?? "?";
}

let failures = 0;
const results = {};

for (const [folder, entries] of Object.entries(GROUPS)) {
  const dir = join(root, "public", folder);
  await mkdir(dir, { recursive: true });
  results[folder] = {};

  for (const [key, url] of Object.entries(entries)) {
    const file = `${key}.${ext(url)}`;
    process.stdout.write(`  ${folder}/${file} … `);
    try {
      await download(url, join(dir, file));
      results[folder][key] = `/${folder}/${file}`;
      console.log("ok");
    } catch (err) {
      failures++;
      console.log(`FAILED (${err.message})`);
      console.log(`    source: ${url}`);
    }
  }
}

console.log(
  failures
    ? `\n${failures} file(s) failed. Those sources may be gone — download them by hand or regenerate.\n`
    : "\nAll files downloaded.\n",
);

const q = (v) => `"${v}"`;
console.log("── Paste this over PHOTOS / GEN / FIRE_FRAMES in src/data/site.ts ──\n");
console.log("export const PHOTOS = {");
for (const [k, v] of Object.entries(results.photos ?? {})) console.log(`  ${k}: ${q(v)},`);
console.log("} as const;\n");
console.log("export const GEN = {");
for (const [k, v] of Object.entries(results.menu ?? {})) console.log(`  ${k}: ${q(v)},`);
console.log("} as const;\n");
console.log("export const FIRE_FRAMES: string[] = [");
for (const v of Object.values(results.hero ?? {})) console.log(`  ${q(v)},`);
console.log("];\n");
console.log("Then delete the pasargadseppala.fi and cloudfront.net entries from");
console.log("`images.remotePatterns` in next.config.ts — nothing remote is left.\n");
