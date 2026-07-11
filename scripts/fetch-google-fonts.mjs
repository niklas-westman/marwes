#!/usr/bin/env node
/**
 * Regenerates `apps/dashboard-teaser/src/data/google-fonts.json` from a public
 * Google Fonts family index. Run this every few months to pick up new families:
 *
 *     node scripts/fetch-google-fonts.mjs
 *
 * Two sources are supported. First the Google Webfonts Helper mirror (public,
 * unauthenticated). If that fails, the script falls back to the official
 * Google Fonts Developer API which needs `GOOGLE_FONTS_API_KEY` in the env.
 *
 * The output is a compact array of `{ family, category, popularity }` sorted
 * by ascending popularity rank — the dashboard combobox consumes it directly.
 */

import { writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, "..", "apps/dashboard-teaser/src/data/google-fonts.json")

const MIRROR_URL = "https://gwfh.mranftl.com/api/fonts"
const OFFICIAL_URL = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity"

/** @typedef {{ family: string; category: string; popularity: number }} SlimFont */

/** @returns {Promise<SlimFont[]>} */
async function fetchFromMirror() {
  const response = await fetch(MIRROR_URL)
  if (!response.ok) throw new Error(`mirror ${MIRROR_URL} returned ${response.status}`)
  const raw = await response.json()
  return raw.map((f) => ({
    family: f.family,
    category: f.category,
    popularity: f.popularity,
  }))
}

/** @returns {Promise<SlimFont[]>} */
async function fetchFromOfficial() {
  const key = process.env.GOOGLE_FONTS_API_KEY
  if (!key) throw new Error("GOOGLE_FONTS_API_KEY not set — cannot use official Google Fonts API")
  const response = await fetch(`${OFFICIAL_URL}&key=${key}`)
  if (!response.ok) throw new Error(`official ${OFFICIAL_URL} returned ${response.status}`)
  const raw = await response.json()
  return raw.items.map((f, index) => ({
    family: f.family,
    category: f.category,
    popularity: index + 1,
  }))
}

async function main() {
  let fonts
  try {
    fonts = await fetchFromMirror()
    console.log(`Fetched ${fonts.length} families from Google Webfonts Helper mirror.`)
  } catch (err) {
    console.warn(`Mirror failed (${err.message}), falling back to official API...`)
    fonts = await fetchFromOfficial()
    console.log(`Fetched ${fonts.length} families from Google Fonts API.`)
  }

  fonts.sort((a, b) => a.popularity - b.popularity)
  await writeFile(OUT, `${JSON.stringify(fonts, null, 2)}\n`, "utf8")
  console.log(`Wrote ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
