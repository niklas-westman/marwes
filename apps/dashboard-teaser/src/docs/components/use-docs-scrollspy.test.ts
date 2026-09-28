// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

import type { DocsSectionId } from "./component-docs-model"
import { docsActivationLine, getActiveSection, getInitialSection } from "./use-docs-scrollspy"

const sections = [
  { id: "what-this-family-solves" as const, top: -300 },
  { id: "recommended-components" as const, top: docsActivationLine },
  { id: "public-imports" as const, top: docsActivationLine + 300 },
]

describe("docs scrollspy", () => {
  it("uses a valid decoded hash, otherwise the first section", () => {
    const ids = sections.map(({ id }) => id)
    expect(getInitialSection(ids, "#recommended-components")).toBe("recommended-components")
    expect(getInitialSection(ids, "#recommended%2Dcomponents")).toBe("recommended-components")
    expect(getInitialSection(ids, "#unknown")).toBe("what-this-family-solves")
    expect(getInitialSection(ids, "#broken%hash")).toBe("what-this-family-solves")
  })

  it("selects the last section at or above the activation line", () => {
    expect(getActiveSection({ sections, atDocumentEnd: false })).toBe("recommended-components")
  })

  it("handles a fast jump directly to a later section", () => {
    expect(
      getActiveSection({
        sections: sections.map((section, index) => ({ ...section, top: index < 3 ? -100 : 500 })),
        atDocumentEnd: false,
      }),
    ).toBe("public-imports")
  })

  it("selects the final section at the document end", () => {
    const allSections = [
      ...sections,
      { id: "resources" as DocsSectionId, top: docsActivationLine + 500 },
    ]
    expect(getActiveSection({ sections: allSections, atDocumentEnd: true })).toBe("resources")
  })
})
