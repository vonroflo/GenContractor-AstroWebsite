/**
 * Generates labeled placeholder photos in src/assets/services/ so the build never
 * depends on hotlinked or unlicensed images. Replace them with real project photos.
 *
 *   node scripts/placeholder-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const outDir = new URL("../src/assets/services/", import.meta.url);
await mkdir(outDir, { recursive: true });

const services = [
  ["concrete-contractor", "Concrete"],
  ["stucco-contractor", "Stucco"],
  ["drywall-contractor", "Drywall"],
  ["waterproofing", "Waterproofing"],
  ["home-remodeling", "Home Remodeling"],
  ["adu-construction", "ADU Construction"],
  ["room-additions", "Room Additions"],
  ["home-repairs", "Home Repairs"],
];

const variants = [
  { suffix: "hero", width: 1600, height: 1000, from: "#1F3A5F", to: "#3B5F8A" },
  { suffix: "gallery-1", width: 1200, height: 900, from: "#334155", to: "#64748B" },
  { suffix: "gallery-2", width: 1200, height: 900, from: "#7C4A1A", to: "#C2702A" },
];

const svg = ({ width, height, from, to }, label, note) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M0 80L80 0" stroke="white" stroke-opacity="0.06" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="${Math.round(width / 18)}" font-weight="700" fill="white" fill-opacity="0.9">${label}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="${Math.round(width / 48)}" fill="white" fill-opacity="0.7">${note}</text>
</svg>`;

for (const [slug, label] of services) {
  for (const v of variants) {
    const note = "Placeholder image — replace with a real project photo";
    await sharp(Buffer.from(svg(v, label, note)))
      .jpeg({ quality: 70, mozjpeg: true })
      .toFile(new URL(`${slug}-${v.suffix}.jpg`, outDir).pathname);
  }
}

console.log(`Wrote ${services.length * variants.length} images to ${outDir.pathname}`);

// Site-wide images (homepage hero, about page).
const siteDir = new URL("../src/assets/site/", import.meta.url);
await mkdir(siteDir, { recursive: true });
const siteImages = [
  ["home-hero", "", variants[0], ""],
  ["about", "Our Team", { ...variants[1], width: 1200, height: 900 }],
];
for (const [name, label, v, note = "Placeholder image — replace with a real photo"] of siteImages) {
  await sharp(Buffer.from(svg(v, label, note)))
    .jpeg({ quality: 70, mozjpeg: true })
    .toFile(new URL(`${name}.jpg`, siteDir).pathname);
}
console.log(`Wrote ${siteImages.length} images to ${siteDir.pathname}`);
