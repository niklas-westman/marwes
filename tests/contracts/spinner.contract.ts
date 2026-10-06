/**
 * Shared contract for the Spinner atom's cross-adapter behavior.
 *
 * Tests decorative mode (aria-hidden), accessible status mode (role=status),
 * variant class names, size tokens, custom pixel sizes, inner SVG hiding,
 * and explicit decorative flag handling.
 */
import type { SpinnerOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type SpinnerVariant =
  | "classic"
  | "ring"
  | "dual"
  | "dots-round"
  | "dots-square"
  | "lines"
  | "cross"

export type SpinnerSize = "xs" | "sm" | "md" | "lg"

export type SpinnerContractHarness = {
  renderSpinner(args?: {
    variant?: SpinnerVariant
    size?: SpinnerSize | number
    decorative?: boolean
    ariaLabel?: string
    label?: string
    id?: string
  }): Promise<void> | void
  getSpinnerElement(): HTMLElement
  getByRole(role: "status"): HTMLElement
  /** Renders the base Spinner with raw core options. */
  renderSpinnerOptions(options: SpinnerOptions): Promise<void> | void
  getSpinnerRoot(): HTMLElement
}

type SpinnerOptionCase = {
  options: SpinnerOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core SpinnerOptions field fails to compile until every adapter's
// handling of it is described by a case.
const spinnerOptionCases: Record<keyof SpinnerOptions, SpinnerOptionCase> = {
  variant: {
    options: { variant: "ring" },
    expectRendered: (root) => expect(root).toHaveClass("mw-spinner--ring"),
  },
  size: {
    options: { size: 56 },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("data-size", "custom")
      expect(root).toHaveStyle({ "--mw-spinner-size": "56px" })
    },
  },
  decorative: {
    options: { decorative: true },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-hidden", "true"),
  },
  ariaLabel: {
    options: { ariaLabel: "Loading orders" },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("role", "status")
      expect(root).toHaveAttribute("aria-label", "Loading orders")
    },
  },
  label: {
    options: { label: "Loading orders" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Loading orders"),
  },
  id: {
    options: { id: "spin" },
    expectRendered: (root) => expect(root).toHaveAttribute("id", "spin"),
  },
}

export function runSpinnerContract(adapterName: string, harness: SpinnerContractHarness): void {
  describe(`Spinner contract: ${adapterName}`, () => {
    it("renders a decorative spinner by default", async () => {
      await harness.renderSpinner()

      const spinnerElement = harness.getSpinnerElement()
      expect(spinnerElement.tagName).toBe("SPAN")
      expect(spinnerElement).toHaveAttribute("aria-hidden", "true")
      expect(spinnerElement.className).toContain("mw-spinner")
      expect(spinnerElement.getAttribute("data-variant")).toBe("classic")
      expect(spinnerElement.getAttribute("data-size")).toBe("sm")
    })

    it("supports accessible status mode, visual variants, and custom sizes", async () => {
      await harness.renderSpinner({
        variant: "dots-round",
        size: 56,
        ariaLabel: "Loading account data",
        id: "loading-spinner",
      })

      const spinnerElement = harness.getByRole("status")
      expect(spinnerElement).toHaveAttribute("id", "loading-spinner")
      expect(spinnerElement).toHaveAttribute("aria-label", "Loading account data")
      expect(spinnerElement).toHaveAttribute("aria-live", "polite")
      expect(spinnerElement.className).toContain("mw-spinner--dots-round")
      expect(spinnerElement).toHaveAttribute("data-size", "custom")
      expect(spinnerElement).toHaveStyle({ "--mw-spinner-size": "56px" })
    })

    it("inner SVG is always aria-hidden and non-focusable so AT ignores the geometry", async () => {
      await harness.renderSpinner({ ariaLabel: "Loading account data" })

      const statusSpinner = harness.getByRole("status")
      const innerSvg = statusSpinner.querySelector("svg")

      expect(innerSvg).not.toBeNull()
      expect(innerSvg).toHaveAttribute("aria-hidden", "true")
      expect(innerSvg).toHaveAttribute("focusable", "false")
    })

    it("token size xs renders with correct data-size attribute", async () => {
      await harness.renderSpinner({ size: "xs" })

      expect(harness.getSpinnerElement()).toHaveAttribute("data-size", "xs")
    })

    it("token size lg renders with correct data-size attribute", async () => {
      await harness.renderSpinner({ size: "lg" })

      expect(harness.getSpinnerElement()).toHaveAttribute("data-size", "lg")
    })

    it("explicit decorative true keeps the spinner hidden from assistive technology", async () => {
      await harness.renderSpinner({ decorative: true })

      const spinner = harness.getSpinnerElement()
      expect(spinner).toHaveAttribute("aria-hidden", "true")
      expect(spinner).not.toHaveAttribute("role")
    })

    it("uses label as the accessible name when ariaLabel is absent", async () => {
      await harness.renderSpinner({ label: "Loading orders" })

      expect(harness.getByRole("status")).toHaveAttribute("aria-label", "Loading orders")
    })

    it("prefers ariaLabel over label", async () => {
      await harness.renderSpinner({ ariaLabel: "Loading account", label: "Loading orders" })

      expect(harness.getByRole("status")).toHaveAttribute("aria-label", "Loading account")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(spinnerOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderSpinnerOptions(optionCase.options)

        const element = harness.getSpinnerRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
