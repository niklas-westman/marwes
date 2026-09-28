#!/usr/bin/env node

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const appRoot = path.join(repoRoot, "apps/dashboard-teaser")
const manifest = JSON.parse(
  await readFile(path.join(appRoot, "src/docs/generated/docs-routes.json"), "utf8"),
)
const componentDocsFamilies = manifest.routes
  .filter((route) => route.renderer === "component-docs")
  .map((route) => route.family)
const componentPageModels = new Map(
  await Promise.all(
    componentDocsFamilies.map(async (family) => [
      family,
      JSON.parse(
        await readFile(path.join(appRoot, "src/docs/generated", `${family}-page.json`), "utf8"),
      ),
    ]),
  ),
)
const failures = []

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function readStaticFrameworkInventory(html, framework) {
  const inventory = html.match(
    new RegExp(`<article data-framework-inventory="${framework}">([\\s\\S]*?)<\\/article>`, "u"),
  )?.[1]
  if (!inventory) return null
  return [...inventory.matchAll(/<code>(.*?)<\/code>/gu)].map((match) => match[1])
}

for (const route of manifest.routes) {
  const outputPath = path.join(appRoot, "dist", route.path.replace(/^\//, ""), "index.html")
  let html
  try {
    html = await readFile(outputPath, "utf8")
  } catch (error) {
    if (error?.code === "ENOENT") {
      failures.push(`${route.path}: missing ${path.relative(repoRoot, outputPath)}`)
      continue
    }
    throw error
  }

  if (!html.includes(`<link rel="canonical" href="https://marwes.io${route.path}"`)) {
    failures.push(`${route.path}: missing canonical URL`)
  }
  if (!html.includes(`<h1>${route.title}</h1>`)) {
    failures.push(`${route.path}: missing static h1 content`)
  }

  const componentModel = route.family ? componentPageModels.get(route.family) : undefined
  if (componentModel) {
    for (const section of componentModel.sections) {
      if (!html.includes(`id="${section.id}"`)) {
        failures.push(`${route.path}: missing static section ${section.id}`)
      }
    }
    for (const framework of componentModel.frameworks) {
      const renderedInventory = readStaticFrameworkInventory(html, framework.framework)
      const renderedExportNames = ["component", "type", "enum", "helper"].flatMap((kind) =>
        framework.exports.filter((entry) => entry.kind === kind).map((entry) => entry.name),
      )
      const expectedInventory = [framework.packageName, ...renderedExportNames]
      if (JSON.stringify(renderedInventory) !== JSON.stringify(expectedInventory)) {
        failures.push(
          `${route.path}: static ${framework.framework} API inventory does not match its generated model`,
        )
      }
      if (!html.includes(escapeHtml(framework.example))) {
        failures.push(`${route.path}: missing static ${framework.framework} fixture`)
      }
    }
    if (!html.includes("/assets/docs-page-main-")) {
      failures.push(`${route.path}: missing generic component docs entrypoint`)
    }
    if (!html.includes('id="component-docs-model" type="application/json"')) {
      failures.push(`${route.path}: missing embedded component docs model`)
    }
    if (html.includes('name="robots" content="noindex')) {
      failures.push(`${route.path}: canonical component page must be indexable`)
    }
  }

  if (route.renderer === "get-started") {
    if (!html.includes('id="get-started-model" type="application/json"')) {
      failures.push(`${route.path}: missing embedded get-started model`)
    }
    if (!html.includes("/assets/docs-page-main-")) {
      failures.push(`${route.path}: missing generic component docs entrypoint`)
    }
  }

  if (route.renderer === "introduction") {
    if (!html.includes('id="introduction-model" type="application/json"')) {
      failures.push(`${route.path}: missing embedded introduction model`)
    }
    if (!html.includes("/assets/docs-page-main-")) {
      failures.push(`${route.path}: missing generic component docs entrypoint`)
    }
  }
}

try {
  await readFile(path.join(appRoot, "dist/docs-preview/input/index.html"), "utf8")
  failures.push("/docs-preview/input/: preview build output must be removed")
} catch (error) {
  if (error?.code !== "ENOENT") throw error
}

if (failures.length > 0) {
  console.error(
    `Dashboard documentation build is invalid:\n${failures.map((failure) => `- ${failure}`).join("\n")}`,
  )
  process.exit(1)
}

console.log(`Checked ${manifest.routes.length} static documentation build outputs.`)
