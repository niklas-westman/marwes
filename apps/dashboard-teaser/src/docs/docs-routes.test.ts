import { readFile } from "node:fs/promises"
import path from "node:path"

import { describe, expect, it } from "vitest"

type DocsManifest = {
  familyCount: number
  routes: Array<{
    description: string
    family?: string
    path: string
    renderer?: "component-docs"
    title: string
  }>
  schemaVersion: number
}

const appRoot = path.resolve(import.meta.dirname, "../..")
const manifestPath = path.join(import.meta.dirname, "generated/docs-routes.json")

async function readManifest(): Promise<DocsManifest> {
  return JSON.parse(await readFile(manifestPath, "utf8")) as DocsManifest
}

describe("static consumer documentation routes", () => {
  it("publishes all registry families and required guide routes", async () => {
    const manifest = await readManifest()
    const paths = manifest.routes.map((route) => route.path)

    expect(manifest.schemaVersion).toBe(1)
    expect(manifest.familyCount).toBe(31)
    expect(manifest.routes.filter((route) => route.family)).toHaveLength(31)
    expect(paths).toEqual(
      expect.arrayContaining([
        "/docs/get-started/react/",
        "/docs/get-started/vue/",
        "/docs/get-started/svelte/",
        "/docs/components/",
        "/docs/theming/",
        "/docs/accessibility/",
        "/docs/integrations/next/",
        "/docs/integrations/nuxt/",
        "/docs/integrations/sveltekit/",
        "/docs/compatibility/",
        "/docs/troubleshooting/",
        "/docs/ai/",
        "/docs/contributing/",
      ]),
    )
  })

  it("emits crawlable HTML with unique metadata for every route", async () => {
    const manifest = await readManifest()
    const titles = new Set<string>()
    const canonicals = new Set<string>()

    for (const route of manifest.routes) {
      const htmlPath = path.join(appRoot, route.path.replace(/^\//, ""), "index.html")
      const html = await readFile(htmlPath, "utf8")
      const title = html.match(/<title>(.*?)<\/title>/)?.[1]
      const canonical = html.match(/<link rel="canonical" href="(.*?)"/u)?.[1]

      expect(html).toContain(`<h1>${route.title}</h1>`)
      expect(html).toContain(
        `<meta name="description" content="${route.description.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`,
      )
      expect(title).toBeTruthy()
      expect(canonical).toBe(`https://marwes.io${route.path}`)
      expect(titles.has(title ?? "")).toBe(false)
      expect(canonicals.has(canonical ?? "")).toBe(false)
      titles.add(title ?? "")
      canonicals.add(canonical ?? "")
    }
  })

  it("keeps the catalog content present before JavaScript runs", async () => {
    const html = await readFile(path.join(appRoot, "docs/components/index.html"), "utf8")

    expect(html.match(/data-component-card/g)).toHaveLength(31)
    expect(html).toContain("PaginationField")
    expect(html).toContain("InputField")
    expect(html).toContain("data-component-search")
  })

  it("keeps canonical component pages complete before JavaScript runs", async () => {
    const manifest = await readManifest()
    const componentDocsRoutes = manifest.routes.filter(
      (route) => route.renderer === "component-docs",
    )

    expect(componentDocsRoutes).toHaveLength(31)
    for (const route of componentDocsRoutes) {
      const family = route.family
      if (!family) throw new Error(`Component docs route is missing a family: ${route.path}`)
      const [html, modelSource] = await Promise.all([
        readFile(path.join(appRoot, `docs/components/${family}/index.html`), "utf8"),
        readFile(path.join(import.meta.dirname, `generated/${family}-page.json`), "utf8"),
      ])
      const model = JSON.parse(modelSource) as {
        family: string
        frameworks: Array<{
          example: string
          exports: Array<{ kind: "component" | "enum" | "helper" | "type"; name: string }>
          framework: string
          packageName: string
        }>
        schemaVersion: number
        sections: Array<{ id: string }>
      }

      expect(model.schemaVersion).toBe(1)
      expect(model.family).toBe(family)
      expect(model.sections).toHaveLength(7)
      for (const section of model.sections) expect(html).toContain(`id="${section.id}"`)
      for (const framework of model.frameworks) {
        const inventory = html.match(
          new RegExp(
            `<article data-framework-inventory="${framework.framework}">([\\s\\S]*?)<\\/article>`,
            "u",
          ),
        )?.[1]
        expect(inventory).toBeTruthy()
        const renderedExportNames = (["component", "type", "enum", "helper"] as const).flatMap(
          (kind) =>
            framework.exports.filter((entry) => entry.kind === kind).map((entry) => entry.name),
        )
        expect(
          [...(inventory ?? "").matchAll(/<code>(.*?)<\/code>/gu)].map((match) => match[1]),
        ).toEqual([framework.packageName, ...renderedExportNames])
      }
      expect(html).toContain('content="index,follow,max-image-preview:large"')
      expect(html).toContain(
        `<link rel="canonical" href="https://marwes.io/docs/components/${family}/"`,
      )
      expect(html).toContain("html.dark #root[data-static-docs]")
      expect(html).toContain("document.documentElement.classList.add(mode)")
      expect(html).toContain('class="component-static-skip" href="#main-content"')
      expect(html).toContain('id="component-docs-model" type="application/json"')
      expect(html).toContain("/src/docs/components/docs-page-main.tsx")
    }
  })
})
