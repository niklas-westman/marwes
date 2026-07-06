import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { JSDOM } from "jsdom"
import { describe, expect, it } from "vitest"

import { dashboardSeo, renderDashboardSeoHead, resolveDashboardSeo } from "./dashboard-seo"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const sourceHtml = readFileSync(path.join(appRoot, "index.html"), "utf8")
const resolvedSeo = resolveDashboardSeo()
const transformedHtml = sourceHtml.replace(
  "<!--dashboard-seo-head-->",
  renderDashboardSeoHead(resolvedSeo),
)
const document = new JSDOM(transformedHtml).window.document

function getMetaByName(name: string): string | null {
  return document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? null
}

function getMetaByProperty(property: string): string | null {
  return document.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ?? null
}

describe("dashboard teaser HTML SEO output", () => {
  it("renders the required static head metadata", () => {
    expect(document.title).toBe(dashboardSeo.title)
    expect(getMetaByName("description")).toBe(dashboardSeo.description)
    expect(getMetaByName("robots")).toBe(dashboardSeo.robots)
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      resolvedSeo.canonicalUrl,
    )
    expect(document.querySelector('link[rel="icon"]')?.getAttribute("href")).toBe(
      "https://d3hobet9plpuvm.cloudfront.net/dashboard-teaser/latest/assets/marwes-icon.svg",
    )
  })

  it("renders Open Graph and Twitter preview metadata", () => {
    expect(getMetaByProperty("og:type")).toBe("website")
    expect(getMetaByProperty("og:site_name")).toBe(dashboardSeo.siteName)
    expect(getMetaByProperty("og:title")).toBe(dashboardSeo.socialTitle)
    expect(getMetaByProperty("og:description")).toBe(dashboardSeo.socialDescription)
    expect(getMetaByProperty("og:url")).toBe(resolvedSeo.canonicalUrl)
    expect(getMetaByProperty("og:image")).toBe(resolvedSeo.imageUrl)
    expect(getMetaByProperty("og:image:width")).toBe(`${dashboardSeo.image.width}`)
    expect(getMetaByProperty("og:image:height")).toBe(`${dashboardSeo.image.height}`)
    expect(getMetaByProperty("og:image:alt")).toBe(dashboardSeo.image.alt)

    expect(getMetaByName("twitter:card")).toBe("summary_large_image")
    expect(getMetaByName("twitter:title")).toBe(dashboardSeo.socialTitle)
    expect(getMetaByName("twitter:description")).toBe(dashboardSeo.socialDescription)
    expect(getMetaByName("twitter:image")).toBe(resolvedSeo.imageUrl)
    expect(getMetaByName("twitter:image:alt")).toBe(dashboardSeo.image.alt)
  })

  it("renders supported JSON-LD scripts", () => {
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')]
    const jsonLd = scripts.map((script) => JSON.parse(script.textContent ?? "{}"))

    expect(jsonLd.map((item) => item["@type"])).toEqual(["SoftwareApplication", "WebSite"])
    expect(JSON.stringify(jsonLd)).not.toContain('"Product"')
    expect(JSON.stringify(jsonLd)).not.toContain('"FAQPage"')
  })

  it("keeps semantic body content available before React executes", () => {
    const root = document.getElementById("root")
    const rootText = root?.textContent?.toLowerCase() ?? ""
    const links = [...document.querySelectorAll("#root a")].map((link) => link.textContent)

    expect(root?.querySelectorAll("h1")).toHaveLength(1)
    expect(rootText).toContain("marwes ui")
    expect(rootText).toContain("framework-agnostic")
    expect(rootText).toContain("ai-friendly")
    expect(rootText).toContain("react")
    expect(rootText).toContain("vue")
    expect(rootText).toContain("svelte")
    expect(rootText).toContain("static css")
    expect(rootText).toContain("css variable")
    expect(rootText).toContain("css modules")
    expect(rootText).toContain("css-in-js")
    expect(rootText).toContain("tailwind-style")
    expect(rootText).toContain("typed themes")
    expect(rootText).toContain("adjustable")
    expect(rootText).toContain("accessibility")
    expect(links).toEqual(["Documentation", "GitHub"])
  })
})
