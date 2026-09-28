import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
  aiPublicationDocumentation,
  aiPublicationResources,
  aiPublicationStorybooks,
} from "../../../../scripts/ai-publication-manifest.mjs"
import { absolutizeRelativeMarkdownLinks } from "../../../../scripts/generate-ai-docs.mjs"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const publicRoot = path.join(appRoot, "public")

function readPublicFile(relativePath: string): string {
  return readFileSync(path.join(publicRoot, relativePath), "utf8")
}

describe("dashboard AI publication", () => {
  it("publishes a schema-versioned index at the approved public paths", () => {
    const index = JSON.parse(readPublicFile("ai/index.json"))

    expect(index.schemaVersion).toBe(1)
    expect(index.resources).toEqual(
      aiPublicationResources.map((resource) => ({
        id: resource.id,
        kind: resource.kind,
        title: resource.title,
        description: resource.description,
        path: resource.path,
        mediaType: resource.mediaType,
        scope: resource.scope,
        ...(resource.framework ? { framework: resource.framework } : {}),
        ...(resource.schemaVersion ? { schemaVersion: resource.schemaVersion } : {}),
      })),
    )
    expect(index.resources.map((resource: { path: string }) => resource.path)).toEqual([
      "/ai/react.md",
      "/ai/svelte.md",
      "/ai/vue.md",
      "/ai/v1/public-api.json",
      "/ai/v1/component-manifest.json",
      "/ai/v1/component-registry.json",
      "/ai/v1/design-provenance.json",
      "/ai/v1/framework-parity.json",
      "/ai/v1/purpose-registry.json",
    ])
    expect(index.storybooks).toEqual(aiPublicationStorybooks)
    expect(index.documentation).toEqual(aiPublicationDocumentation)
  })

  it("distinguishes the complete family registry from canonical semantic coverage", () => {
    const index = JSON.parse(readPublicFile("ai/index.json"))

    expect(index.registry.componentFamilyCount).toBe(31)
    expect(index.registry.canonicalSemanticFamilyCount).toBe(9)
    expect(index.registry.canonicalSemanticFamilies).toEqual([
      "avatar",
      "badge",
      "banner",
      "breadcrumb",
      "button",
      "context-menu",
      "dialog",
      "drawer",
      "toast",
    ])
  })

  it("instructs agents to import real components instead of inventing replacements", () => {
    const llmsTxt = readPublicFile("llms.txt")
    const index = readPublicFile("ai/index.json")

    expect(llmsTxt).toContain("Import and use real Marwes components")
    expect(llmsTxt).toContain("Do not invent `mw-*` replacement components")
    expect(index).toContain("Import and use real Marwes components")
    expect(index).toContain("Do not invent mw-* replacement components")
    for (const framework of ["react", "vue", "svelte"]) {
      const guide = readPublicFile(`ai/${framework}.md`)
      expect(guide).toContain(
        `Import and use real Marwes components from \`@marwes-ui/${framework}\``,
      )
      expect(guide).toContain("Do not invent `mw-*` replacement components")
    }
    for (const storybook of aiPublicationStorybooks) {
      expect(llmsTxt).toContain(storybook.catalogUrl)
      expect(index).toContain(storybook.catalogUrl)
    }
  })

  it("converts relative inline and reference links to absolute GitHub URLs", () => {
    const markdown = [
      "[Guide](../../docs/guides/adding-components.md#presets)",
      "![Preview](./preview.png)",
      "[reference]: ../core/README.md",
      "[External](https://marwes.io)",
      "[Section](#install)",
    ].join("\n")

    expect(absolutizeRelativeMarkdownLinks(markdown, "packages/react/README.md")).toBe(
      [
        "[Guide](https://github.com/niklas-westman/marwes/blob/main/docs/guides/adding-components.md#presets)",
        "![Preview](https://github.com/niklas-westman/marwes/raw/main/packages/react/preview.png)",
        "[reference]: https://github.com/niklas-westman/marwes/blob/main/packages/core/README.md",
        "[External](https://marwes.io)",
        "[Section](#install)",
      ].join("\n"),
    )
  })

  it("generates the sitemap from publication paths without wall-clock metadata", () => {
    const sitemap = readPublicFile("sitemap.xml")

    for (const resource of aiPublicationResources) {
      expect(sitemap).toContain(`<loc>${resource.url}</loc>`)
    }

    expect(sitemap).toContain("<loc>https://marwes.io/llms.txt</loc>")
    expect(sitemap).toContain("<loc>https://marwes.io/ai/index.json</loc>")
    for (const resource of aiPublicationDocumentation) {
      expect(sitemap).toContain(`<loc>${resource.url}</loc>`)
    }
    expect(sitemap).not.toContain("<lastmod>")
  })
})
