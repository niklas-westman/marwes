/**
 * Shared contract for the Breadcrumb atom — every core option reaches the DOM in each adapter.
 */
import type { BreadcrumbOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface BreadcrumbContractHarness {
  /** Renders the base component with raw core options. */
  renderBreadcrumbOptions(options: BreadcrumbOptions): Promise<void> | void
  getBreadcrumbRoot(): HTMLElement
}

type BreadcrumbOptionCase = {
  options: BreadcrumbOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core BreadcrumbOptions field fails to compile until every adapter's
// handling of it is described by a case.
const trail = [
  { label: "Docs", href: "/docs" },
  { label: "Guide", current: true },
] as const

const breadcrumbOptionCases: Record<keyof BreadcrumbOptions, BreadcrumbOptionCase> = {
  items: {
    options: { items: trail, showHome: false },
    expectRendered: (root) => {
      expect(root.querySelectorAll("li")).toHaveLength(2)
      expect(root.querySelector('a[href="/docs"]')).toHaveTextContent("Docs")
      expect(root.querySelector('[aria-current="page"]')).toHaveTextContent("Guide")
    },
  },
  ariaLabel: {
    options: { items: trail, ariaLabel: "You are here" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "You are here"),
  },
  showHome: {
    options: { items: trail, showHome: true, homeHref: "/" },
    expectRendered: (root) => {
      expect(root.querySelectorAll("li")).toHaveLength(3)
      expect(root.querySelector('a[href="/"]')).toBeInTheDocument()
    },
  },
  homeHref: {
    options: { items: trail, showHome: true, homeHref: "/start" },
    expectRendered: (root) => expect(root.querySelector('a[href="/start"]')).toBeInTheDocument(),
  },
  homeLabel: {
    options: { items: trail, showHome: true, homeHref: "/", homeLabel: "Start page" },
    expectRendered: (root) =>
      expect(root.querySelector('a[href="/"]')).toHaveAttribute("aria-label", "Start page"),
  },
  dataAttributes: {
    options: { items: trail, dataAttributes: { "data-testid": "crumbs" } },
    expectRendered: (root) => expect(root).toHaveAttribute("data-testid", "crumbs"),
  },
}

export function runBreadcrumbContract(
  adapterName: string,
  harness: BreadcrumbContractHarness,
): void {
  describe(`Breadcrumb contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(breadcrumbOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderBreadcrumbOptions(optionCase.options)

        const root = harness.getBreadcrumbRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })
  })
}
