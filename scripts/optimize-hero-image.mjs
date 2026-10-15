import { stat } from "node:fs/promises";
import sharp from "sharp";

const input = "public/img/samarkand-registan.jpg";
const output = "public/img/samarkand-registan.webp";
const budget = 300 * 1024;

if (process.argv.includes("--check")) {
  const image = await stat(output);
  if (image.size > budget) throw new Error(`Optimized hero image is too large (${image.size} bytes)`);
  console.log(`HERO_IMAGE_OPTIMIZED: ${image.size} bytes`);
} else {
  await sharp(input).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(output);
  const image = await stat(output);
  if (image.size > budget) throw new Error(`Optimized hero image is too large (${image.size} bytes)`);
  console.log(`HERO_IMAGE_OPTIMIZED: ${image.size} bytes`);
}
