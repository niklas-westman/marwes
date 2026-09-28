import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import {
  aiPublicationDocumentation,
  aiPublicationResources,
  aiPublicationStorybooks,
  getAiPublicationRoutes,
  githubBranch,
  githubRepositoryUrl,
  siteOrigin,
} from "./ai-publication-manifest.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const committedOutputRoot = path.resolve(repoRoot, "apps/dashboard-teaser/public")

function githubUrlForRelativeTarget(sourcePath, target, image) {
  if (
    target.startsWith("#") ||
    target.startsWith("/") ||
    target.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(target)
  ) {
    return target
  }

  const suffixIndex = target.search(/[?#]/)
  const relativePath = suffixIndex === -1 ? target : target.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? "" : target.slice(suffixIndex)
  const resolvedPath = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePath), relativePath),
  )
  const githubSurface = image ? "raw" : "blob"

  return `${githubRepositoryUrl}/${githubSurface}/${githubBranch}/${resolvedPath}${suffix}`
}

export function absolutizeRelativeMarkdownLinks(markdown, sourcePath) {
  const inlineLinks = markdown.replace(
    /(!?\[[^\]]*\]\()(<[^>]+>|[^) \t]+)(?:(\s+(?:"[^"]*"|'[^']*'|\([^)]*\))))?(\))/g,
    (_match, opening, rawTarget, title, closing) => {
      const wrappedInAngles = rawTarget.startsWith("<") && rawTarget.endsWith(">")
      const target = wrappedInAngles ? rawTarget.slice(1, -1) : rawTarget
      const absoluteTarget = githubUrlForRelativeTarget(sourcePath, target, opening.startsWith("!"))
      const renderedTarget = wrappedInAngles ? `<${absoluteTarget}>` : absoluteTarget
      return `${opening}${renderedTarget}${title ?? ""}${closing}`
    },
  )

  return inlineLinks.replace(
    /^(\s{0,3}\[[^\]]+\]:\s*)(<[^>]+>|\S+)/gm,
    (_match, opening, rawTarget) => {
      const wrappedInAngles = rawTarget.startsWith("<") && rawTarget.endsWith(">")
      const target = wrappedInAngles ? rawTarget.slice(1, -1) : rawTarget
      const absoluteTarget = githubUrlForRelativeTarget(sourcePath, target, false)
      const renderedTarget = wrappedInAngles ? `<${absoluteTarget}>` : absoluteTarget
      return `${opening}${renderedTarget}`
    },
  )
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.resolve(repoRoot, relativePath), "utf8"))
}

function buildRegistrySummary() {
  const componentRegistry = readJson("artifacts/component-registry.json")
  const componentFamilies = componentRegistry.families
    .map((entry) => entry.family)
    .sort((left, right) => left.localeCompare(right))
  const canonicalSemanticFamilies = componentRegistry.families
    .filter((entry) => entry.generated.semantics.coverageLevel === "canonical")
    .map((entry) => entry.family)
    .sort((left, right) => left.localeCompare(right))

  return {
    componentFamilyCount: componentFamilies.length,
    componentFamilies,
    canonicalSemanticFamilyCount: canonicalSemanticFamilies.length,
    canonicalSemanticFamilies,
    note: `${componentFamilies.length} component families are documented in the complete registry. ${canonicalSemanticFamilies.length} of those families currently belong to the canonical cross-family semantic protocol.`,
  }
}

function buildPublicResourceRecord(resource) {
  return {
    id: resource.id,
    kind: resource.kind,
    title: resource.title,
    description: resource.description,
    path: resource.path,
    mediaType: resource.mediaType,
    scope: resource.scope,
    ...(resource.framework ? { framework: resource.framework } : {}),
    ...(resource.schemaVersion ? { schemaVersion: resource.schemaVersion } : {}),
  }
}

function buildAiIndex(registry) {
  return {
    schemaVersion: 1,
    name: "Marwes UI AI resources",
    description:
      "Deterministic package documentation and machine-readable trust artifacts for Marwes UI.",
    instructions: [
      "Import and use real Marwes components from @marwes-ui/react, @marwes-ui/vue, or @marwes-ui/svelte for the selected framework.",
      "Do not invent mw-* replacement components or custom elements. Use the public exports documented by the matching Marwes adapter.",
      "Treat the complete component registry and the canonical semantic subset as different scopes; only the named canonical families share the cross-family semantic protocol.",
    ],
    registry,
    resources: aiPublicationResources.map(buildPublicResourceRecord),
    documentation: aiPublicationDocumentation,
    storybooks: aiPublicationStorybooks,
  }
}

function buildLlmsTxt(registry) {
  const packageResources = aiPublicationResources.filter(
    (resource) => resource.kind === "package-readme",
  )
  const artifactResources = aiPublicationResources.filter(
    (resource) => resource.kind === "artifact",
  )
  const canonicalFamilies = registry.canonicalSemanticFamilies.join(", ")
  const lines = [
    "# Marwes UI",
    "",
    "> Marwes UI is a themeable, accessibility-first component library for React, Vue, and Svelte.",
    "",
    "## Instructions for AI coding agents",
    "",
    "- Import and use real Marwes components from `@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte` for the selected framework.",
    "- Do not invent `mw-*` replacement components or custom elements. Use the public exports documented by the matching Marwes adapter.",
    `- The complete registry documents ${registry.componentFamilyCount} component families. The canonical cross-family semantic subset contains ${registry.canonicalSemanticFamilyCount}: ${canonicalFamilies}.`,
    "- Use the complete component registry for family discovery and the canonical artifacts for shared semantic and purpose contracts.",
    "",
    "## Package documentation",
    "",
    ...packageResources.map(
      (resource) => `- [${resource.title}](${resource.url}): ${resource.description}`,
    ),
    "",
    "## Machine-readable resources",
    "",
    `- [AI resource index](${siteOrigin}/ai/index.json): Schema-versioned resource records and publication guidance.`,
    ...artifactResources.map(
      (resource) => `- [${resource.title}](${resource.url}): ${resource.description}`,
    ),
    "",
    "## Consumer documentation",
    "",
    ...aiPublicationDocumentation.map(
      (resource) => `- [${resource.title}](${resource.url}): ${resource.description}`,
    ),
    "",
    "## Live Storybook catalogs",
    "",
    ...aiPublicationStorybooks.map(
      (storybook) =>
        `- [${storybook.framework} Storybook catalog](${storybook.catalogUrl}): Live machine-readable component stories.`,
    ),
    "",
  ]

  return lines.join("\n")
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function buildSitemap(families) {
  const urls = getAiPublicationRoutes(families).map((route) => {
    const url = new URL(route, siteOrigin).href
    return `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n")
}

function writeOutput(outputRoot, relativePath, content) {
  const outputPath = path.resolve(outputRoot, relativePath)
  mkdirSync(path.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, content, "utf8")
}

function buildFrameworkGuide(resource, sourceContent) {
  const readme = absolutizeRelativeMarkdownLinks(sourceContent, resource.sourcePath)

  return [
    "# AI implementation instructions",
    "",
    `> Import and use real Marwes components from \`@marwes-ui/${resource.framework}\`.`,
    "> Do not invent `mw-*` replacement components or custom elements; use the adapter's documented public exports.",
    "",
    readme,
  ].join("\n")
}

export function generateAiPublication(outputRoot) {
  const registry = buildRegistrySummary()
  rmSync(path.resolve(outputRoot, "ai"), { recursive: true, force: true })

  for (const resource of aiPublicationResources) {
    const sourceContent = readFileSync(path.resolve(repoRoot, resource.sourcePath), "utf8")
    const outputContent =
      resource.kind === "package-readme"
        ? buildFrameworkGuide(resource, sourceContent)
        : sourceContent

    writeOutput(outputRoot, resource.outputPath, outputContent)
  }

  writeOutput(outputRoot, "ai/index.json", `${JSON.stringify(buildAiIndex(registry), null, 2)}\n`)
  writeOutput(outputRoot, "llms.txt", buildLlmsTxt(registry))
  writeOutput(outputRoot, "sitemap.xml", buildSitemap(registry.componentFamilies))
}

function listFiles(directory, prefix = "") {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.posix.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)
    return entry.isDirectory() ? listFiles(absolutePath, relativePath) : [relativePath]
  })
}

function checkGeneratedPublication(generatedOutputRoot) {
  const generatedAiPaths = listFiles(path.join(generatedOutputRoot, "ai"), "ai")
  const committedAiPaths = listFiles(path.join(committedOutputRoot, "ai"), "ai")
  const expectedPaths = ["llms.txt", "sitemap.xml", ...generatedAiPaths]
  const changedOrMissingPaths = expectedPaths.filter((relativePath) => {
    const generatedPath = path.resolve(generatedOutputRoot, relativePath)
    const committedPath = path.resolve(committedOutputRoot, relativePath)

    return (
      !existsSync(committedPath) ||
      readFileSync(generatedPath, "utf8") !== readFileSync(committedPath, "utf8")
    )
  })
  const obsoletePaths = committedAiPaths.filter(
    (relativePath) => !generatedAiPaths.includes(relativePath),
  )
  const stalePaths = [...new Set([...changedOrMissingPaths, ...obsoletePaths])].sort()

  if (stalePaths.length > 0) {
    throw new Error(
      `AI publication is stale: ${stalePaths.join(", ")}. Run pnpm --filter dashboard-teaser generate:ai.`,
    )
  }
}

async function main() {
  if (!process.argv.includes("--check")) {
    generateAiPublication(committedOutputRoot)
    console.log(`✓ Generated ${aiPublicationResources.length} AI resources and publication indexes`)
    return
  }

  const temporaryOutputRoot = mkdtempSync(path.join(tmpdir(), "marwes-ai-publication-"))

  try {
    generateAiPublication(temporaryOutputRoot)
    checkGeneratedPublication(temporaryOutputRoot)
    console.log(`✓ AI publication is up to date (${aiPublicationResources.length} resources)`)
  } finally {
    rmSync(temporaryOutputRoot, { recursive: true, force: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
