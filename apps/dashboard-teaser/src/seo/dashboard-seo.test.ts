import { describe, expect, it } from "vitest"

import {
  dashboardSeo,
  getDashboardJsonLd,
  resolveDashboardSeo,
  toAbsoluteUrl,
} from "./dashboard-seo"

describe("dashboardSeo", () => {
  it("keeps search metadata within useful preview budgets", () => {
    expect(dashboardSeo.title.length).toBeLessThanOrEqual(60)
    expect(dashboardSeo.description.length).toBeGreaterThanOrEqual(120)
    expect(dashboardSeo.description.length).toBeLessThanOrEqual(160)
    expect(dashboardSeo.socialDescription.length).toBeLessThanOrEqual(200)
  })

  it("resolves canonical and asset URLs from the configured origin and base path", () => {
    expect(resolveDashboardSeo().canonicalUrl).toBe(
      "https://d3hobet9plpuvm.cloudfront.net/dashboard-teaser/latest/",
    )
    expect(
      resolveDashboardSeo({
        basePath: "custom/base",
        siteOrigin: "https://example.com/",
      }).canonicalUrl,
    ).toBe("https://example.com/custom/base/")
    expect(
      toAbsoluteUrl("assets/marwes-ui-social-preview.png", {
        basePath: "/custom/base/",
        siteOrigin: "https://example.com",
      }),
    ).toBe("https://example.com/custom/base/assets/marwes-ui-social-preview.png")
  })

  it("keeps the visible search-intent terms in the contract", () => {
    const contractText = [
      dashboardSeo.title,
      dashboardSeo.description,
      dashboardSeo.socialDescription,
      ...dashboardSeo.capabilities,
    ]
      .join(" ")
      .toLowerCase()

    for (const term of [
      "framework-agnostic",
      "react",
      "vue",
      "svelte",
      "ai-friendly",
      "semantic",
      "static css",
      "css variable",
      "css modules",
      "css-in-js",
      "tailwind-style",
      "typed theme",
      "adjustable",
      "accessibility",
      "component",
    ]) {
      expect(contractText).toContain(term)
    }
  })

  it("uses truthful JSON-LD schema types and fields", () => {
    const resolvedSeo = resolveDashboardSeo()
    const jsonLd = getDashboardJsonLd(resolvedSeo)
    const schemaTypes = jsonLd.map((item) => item["@type"])

    expect(schemaTypes).toEqual(["SoftwareApplication", "WebSite"])
    expect(schemaTypes).not.toContain("Product")
    expect(schemaTypes).not.toContain("FAQPage")

    expect(jsonLd[0]).toMatchObject({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: resolvedSeo.canonicalUrl,
    })
    expect(JSON.stringify(jsonLd[0])).toContain("React")
    expect(JSON.stringify(jsonLd[0])).toContain("Vue")
    expect(JSON.stringify(jsonLd[0])).toContain("Svelte")
    expect(JSON.stringify(jsonLd[0])).toContain("framework-agnostic")
    expect(JSON.stringify(jsonLd[0])).toContain("AI-friendly")
    expect(JSON.stringify(jsonLd[0])).toContain("CSS Modules")
    expect(JSON.stringify(jsonLd[0])).toContain("Tailwind-style")
    expect(JSON.stringify(jsonLd[0])).toContain("Typed adjustable theme")
  })
})
