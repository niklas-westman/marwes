import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { getDashboardDocsPaths } from "./dashboard-doc-routes.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dashboardDist = path.join(repoRoot, "apps/dashboard-teaser/dist")
const storybookDistRoots = ["react", "vue", "svelte"].map((framework) => ({
  framework,
  root: path.join(repoRoot, `apps/storybook-${framework}/storybook-static`),
}))
const expectedAiResources = [
  "ai/react.md",
  "ai/vue.md",
  "ai/svelte.md",
  "ai/v1/public-api.json",
  "ai/v1/component-registry.json",
  "ai/v1/component-manifest.json",
  "ai/v1/purpose-registry.json",
  "ai/v1/framework-parity.json",
  "ai/v1/design-provenance.json",
]
const registrySource = JSON.parse(
  await readFile(path.join(repoRoot, "artifacts/component-registry.json"), "utf8"),
)
const expectedDocsRoutes = getDashboardDocsPaths(
  registrySource.families.map((entry) => entry.family),
)
const findings = []

function report(message) {
  findings.push(message)
}

async function readRequiredFile(root, relativePath) {
  const absolutePath = path.join(root, relativePath)

  try {
    const fileStat = await stat(absolutePath)
    if (!fileStat.isFile()) {
      report(`${path.relative(repoRoot, absolutePath)}: expected a file`)
      return undefined
    }
    return await readFile(absolutePath, "utf8")
  } catch {
    report(`${path.relative(repoRoot, absolutePath)}: missing build output`)
    return undefined
  }
}

function parseJson(content, label) {
  try {
    return JSON.parse(content)
  } catch (error) {
    report(`${label}: invalid JSON (${error.message})`)
    return undefined
  }
}

function normalizeResourcePath(resourcePath) {
  if (typeof resourcePath !== "string" || resourcePath.length === 0) {
    return undefined
  }

  const withoutLeadingSlash = resourcePath.replace(/^\/+/, "")
  const normalized = path.posix.normalize(withoutLeadingSlash)
  if (
    normalized === "." ||
    normalized.startsWith("../") ||
    path.posix.isAbsolute(normalized) ||
    /[?#]/.test(normalized)
  ) {
    return undefined
  }

  return normalized
}

function extractAttribute(html, elementPattern, attribute) {
  const element = html.match(elementPattern)?.[0]
  if (!element) {
    return undefined
  }

  return element.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1]
}

function extractCanonicalUrl(html) {
  return extractAttribute(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, "href")
}

function extractRobotsMeta(html) {
  return extractAttribute(html, /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i, "content")
}

function assertNoIndex(html, label) {
  const robots = extractRobotsMeta(html)
  const directives = new Set(
    (robots ?? "")
      .toLowerCase()
      .split(",")
      .map((directive) => directive.trim()),
  )

  if (!directives.has("noindex")) {
    report(`${label}: robots meta must include noindex`)
  }
}

function assertFallbackLinks(indexHtml) {
  const fallback = indexHtml.match(
    /<main\b[^>]*class=["'][^"']*\bseo-fallback\b[^"']*["'][^>]*>[\s\S]*?<\/main>/i,
  )?.[0]
  if (!fallback) {
    report("apps/dashboard-teaser/dist/index.html: missing static SEO fallback")
    return
  }

  const hrefs = new Set(
    [...fallback.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]),
  )
  const requiredHrefs = [
    "/llms.txt",
    "/ai/react.md",
    "/ai/vue.md",
    "/ai/svelte.md",
    "https://storybook-react.marwes.io/latest/",
    "https://storybook-vue.marwes.io/latest/",
    "https://storybook-svelte.marwes.io/latest/",
  ]
  for (const requiredHref of requiredHrefs) {
    if (!hrefs.has(requiredHref)) {
      report(`apps/dashboard-teaser/dist/index.html: SEO fallback must link to ${requiredHref}`)
    }
  }
}

function assertRobotsAndSitemap(robots, sitemap, canonicalUrl) {
  if (!/^User-agent:\s*\*$/im.test(robots) || !/^Allow:\s*\/$/im.test(robots)) {
    report("apps/dashboard-teaser/dist/robots.txt: must allow all crawlers")
  }
  if (/^Disallow:\s*\/\s*$/im.test(robots)) {
    report("apps/dashboard-teaser/dist/robots.txt: root must not be disallowed")
  }

  const sitemapDirective = robots.match(/^Sitemap:\s*(\S+)\s*$/im)?.[1]
  if (!sitemapDirective) {
    report("apps/dashboard-teaser/dist/robots.txt: missing Sitemap directive")
    return
  }

  let expectedSitemapUrl
  try {
    expectedSitemapUrl = new URL("sitemap.xml", canonicalUrl).toString()
  } catch {
    report("apps/dashboard-teaser/dist/index.html: canonical URL is invalid")
    return
  }

  if (sitemapDirective !== expectedSitemapUrl) {
    report(`apps/dashboard-teaser/dist/robots.txt: Sitemap must be ${expectedSitemapUrl}`)
  }

  const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1])
  if (sitemapUrls.length === 0) {
    report("apps/dashboard-teaser/dist/sitemap.xml: contains no URLs")
  }
  if (new Set(sitemapUrls).size !== sitemapUrls.length) {
    report("apps/dashboard-teaser/dist/sitemap.xml: contains duplicate URLs")
  }
  if (!sitemapUrls.includes(canonicalUrl)) {
    report("apps/dashboard-teaser/dist/sitemap.xml: must include the canonical dashboard URL")
  }

  const expectedSitemapPaths = [
    "/llms.txt",
    "/ai/index.json",
    ...expectedAiResources,
    ...expectedDocsRoutes,
  ]
  for (const expectedPath of expectedSitemapPaths) {
    const expectedUrl = new URL(`/${expectedPath.replace(/^\/+/, "")}`, canonicalUrl).toString()
    if (!sitemapUrls.includes(expectedUrl)) {
      report(`apps/dashboard-teaser/dist/sitemap.xml: missing ${expectedUrl}`)
    }
  }

  const canonicalOrigin = new URL(canonicalUrl).origin
  for (const sitemapUrl of sitemapUrls) {
    try {
      if (new URL(sitemapUrl).origin !== canonicalOrigin) {
        report(`apps/dashboard-teaser/dist/sitemap.xml: cross-origin URL ${sitemapUrl}`)
      }
    } catch {
      report(`apps/dashboard-teaser/dist/sitemap.xml: invalid URL ${sitemapUrl}`)
    }
  }
}

async function assertAiResources(indexContent, llmsContent) {
  const indexPath = "apps/dashboard-teaser/dist/ai/index.json"
  const index = parseJson(indexContent, indexPath)
  if (!index || typeof index !== "object") {
    return
  }
  if (index.schemaVersion !== 1) {
    report(`${indexPath}: schemaVersion must be 1`)
  }
  if (!Array.isArray(index.resources)) {
    report(`${indexPath}: resources must be an array`)
    return
  }

  const indexedPaths = new Set()
  for (const [position, resource] of index.resources.entries()) {
    const label = `${indexPath}: resources[${position}]`
    if (!resource || typeof resource !== "object" || Array.isArray(resource)) {
      report(`${label} must be an object`)
      continue
    }

    const resourcePath = normalizeResourcePath(resource.path)
    if (!resourcePath) {
      report(`${label}.path must be a safe site-relative path`)
      continue
    }
    if (indexedPaths.has(resourcePath)) {
      report(`${indexPath}: duplicate resource path ${resourcePath}`)
    }
    indexedPaths.add(resourcePath)

    for (const requiredString of ["mediaType", "scope"]) {
      if (typeof resource[requiredString] !== "string" || resource[requiredString].trim() === "") {
        report(`${label}.${requiredString} must be a non-empty string`)
      }
    }
    if (
      resource.schemaVersion !== undefined &&
      (!Number.isInteger(resource.schemaVersion) || resource.schemaVersion < 1)
    ) {
      report(`${label}.schemaVersion must be a positive integer when present`)
    }
    if (
      resource.framework !== undefined &&
      (typeof resource.framework !== "string" || resource.framework.trim() === "")
    ) {
      report(`${label}.framework must be a non-empty string when present`)
    }

    const resourceContent = await readRequiredFile(dashboardDist, resourcePath)
    const expectedMediaType = resourcePath.endsWith(".json")
      ? "application/json"
      : resourcePath.endsWith(".md")
        ? "text/plain"
        : undefined
    if (expectedMediaType && resource.mediaType !== expectedMediaType) {
      report(`${label}.mediaType must be ${expectedMediaType} for ${resourcePath}`)
    }
    if (resourceContent && resourcePath.endsWith(".json")) {
      parseJson(resourceContent, `apps/dashboard-teaser/dist/${resourcePath}`)
    }
  }

  for (const expectedPath of expectedAiResources) {
    if (!indexedPaths.has(expectedPath)) {
      report(`${indexPath}: missing resource record for ${expectedPath}`)
    }
    if (!llmsContent.includes(`/${expectedPath}`) && !llmsContent.includes(expectedPath)) {
      report(`apps/dashboard-teaser/dist/llms.txt: missing link to ${expectedPath}`)
    }
  }

  const registryContent = await readRequiredFile(dashboardDist, "ai/v1/component-registry.json")
  const manifestContent = await readRequiredFile(dashboardDist, "ai/v1/component-manifest.json")
  const publicApiContent = await readRequiredFile(dashboardDist, "ai/v1/public-api.json")
  if (!registryContent || !manifestContent || !publicApiContent) {
    return
  }

  const registry = parseJson(
    registryContent,
    "apps/dashboard-teaser/dist/ai/v1/component-registry.json",
  )
  const manifest = parseJson(
    manifestContent,
    "apps/dashboard-teaser/dist/ai/v1/component-manifest.json",
  )
  const publicApi = parseJson(publicApiContent, "apps/dashboard-teaser/dist/ai/v1/public-api.json")
  const families = registry?.families
  const components = manifest?.components
  if (!Array.isArray(families) || families.length !== 31) {
    report("component-registry.json: families must contain all 31 registry families")
  }
  if (!Array.isArray(components) || components.length === 0) {
    report("component-manifest.json: components must contain the canonical semantic subset")
    return
  }
  if (Array.isArray(families) && components.length >= families.length) {
    report(
      "component-manifest.json: canonical semantic components must remain a subset of the 31 registry families",
    )
  }

  const registryFamilies = new Set(
    Array.isArray(families) ? families.map((family) => family?.family).filter(Boolean) : [],
  )
  if (Array.isArray(families) && registryFamilies.size !== families.length) {
    report("component-registry.json: registry family names must be present and unique")
  }
  for (const component of components) {
    if (typeof component?.family !== "string" || !registryFamilies.has(component.family)) {
      report(
        `component-manifest.json: canonical component ${component?.name ?? "<unknown>"} has an unknown family`,
      )
    }
  }

  if (publicApi?.schemaVersion !== 1 || !Array.isArray(publicApi?.packages)) {
    report("public-api.json: must have schemaVersion 1 and a packages array")
    return
  }
  const expectedPackages = new Set(["@marwes-ui/react", "@marwes-ui/vue", "@marwes-ui/svelte"])
  const seenPackages = new Set()
  for (const packageRecord of publicApi.packages) {
    const packageName = packageRecord?.package
    if (!expectedPackages.has(packageName) || seenPackages.has(packageName)) {
      report(`public-api.json: unexpected or duplicate package ${packageName ?? "<missing>"}`)
      continue
    }
    seenPackages.add(packageName)
    if (packageRecord.importPath !== packageName || !Array.isArray(packageRecord.exports)) {
      report(`public-api.json: ${packageName} must use its root import and expose an exports array`)
      continue
    }
    const seenExports = new Set()
    for (const entry of packageRecord.exports) {
      if (typeof entry?.name !== "string" || seenExports.has(entry.name)) {
        report(`public-api.json: ${packageName} export names must be present and unique`)
      }
      seenExports.add(entry?.name)
      if (!["component", "type", "enum", "helper"].includes(entry?.kind)) {
        report(`public-api.json: ${packageName}.${entry?.name ?? "<missing>"} has invalid kind`)
      }
      if (entry?.importPath !== packageName) {
        report(`public-api.json: ${packageName}.${entry?.name ?? "<missing>"} must use root import`)
      }
      if (entry?.family !== undefined && !registryFamilies.has(entry.family)) {
        report(`public-api.json: ${packageName}.${entry?.name ?? "<missing>"} has unknown family`)
      }
    }
  }
  if (seenPackages.size !== expectedPackages.size) {
    report("public-api.json: React, Vue, and Svelte packages are required")
  }
}

async function checkDashboard() {
  const [indexHtml, notFoundHtml, robots, sitemap, llms, aiIndex] = await Promise.all([
    readRequiredFile(dashboardDist, "index.html"),
    readRequiredFile(dashboardDist, "404.html"),
    readRequiredFile(dashboardDist, "robots.txt"),
    readRequiredFile(dashboardDist, "sitemap.xml"),
    readRequiredFile(dashboardDist, "llms.txt"),
    readRequiredFile(dashboardDist, "ai/index.json"),
    ...expectedAiResources.map((resourcePath) => readRequiredFile(dashboardDist, resourcePath)),
  ])

  if (indexHtml) {
    const canonicalUrl = extractCanonicalUrl(indexHtml)
    if (!canonicalUrl) {
      report("apps/dashboard-teaser/dist/index.html: missing canonical URL")
    } else if (robots && sitemap) {
      assertRobotsAndSitemap(robots, sitemap, canonicalUrl)
    }
    assertFallbackLinks(indexHtml)
  }
  if (notFoundHtml) {
    assertNoIndex(notFoundHtml, "apps/dashboard-teaser/dist/404.html")
    if (!/<a\b[^>]*href=["']\/["'][^>]*>/i.test(notFoundHtml)) {
      report("apps/dashboard-teaser/dist/404.html: missing fallback link to /")
    }
  }
  if (llms && aiIndex) {
    await assertAiResources(aiIndex, llms)
  }
  for (const route of expectedDocsRoutes) {
    await readRequiredFile(dashboardDist, `${route.replace(/^\/+/, "")}index.html`)
  }
}

async function checkStorybooks() {
  for (const { framework, root } of storybookDistRoots) {
    const [robots, managerHtml, previewHtml] = await Promise.all([
      readRequiredFile(root, "robots.txt"),
      readRequiredFile(root, "index.html"),
      readRequiredFile(root, "iframe.html"),
    ])
    const label = `apps/storybook-${framework}/storybook-static`

    if (robots && (!/^User-agent:\s*\*$/im.test(robots) || !/^Allow:\s*\/$/im.test(robots))) {
      report(`${label}/robots.txt: must allow crawling so page-level noindex is visible`)
    }
    if (managerHtml) {
      assertNoIndex(managerHtml, `${label}/index.html`)
    }
    if (previewHtml) {
      assertNoIndex(previewHtml, `${label}/iframe.html`)
    }
  }
}

await checkDashboard()
await checkStorybooks()

if (findings.length > 0) {
  console.error("Site crawlability check failed:\n")
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exitCode = 1
} else {
  console.log(
    "Site crawlability is coherent across the dashboard and React, Vue, and Svelte Storybooks.",
  )
}
