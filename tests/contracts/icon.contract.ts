import { describe, expect, it } from "vitest"

export type IconSize = "xs" | "sm" | "md" | "lg" | number
export type IconStrokeWidth = "xs" | "sm" | "md" | "lg" | number

export type IconContractHarness = {
  renderIcon(args?: {
    ariaLabel?: string
    size?: IconSize
    strokeWidth?: IconStrokeWidth
  }): Promise<void> | void
  getByRole(role: "img", options: { name: RegExp }): SVGElement
  queryByRole(role: "img"): SVGElement | null
  querySvg(): SVGElement | null
}

export function runIconContract(adapterName: string, harness: IconContractHarness): void {
  describe(`Icon contract: ${adapterName}`, () => {
    it("treats unlabeled icons as decorative", async () => {
      await harness.renderIcon()

      const iconElement = harness.querySvg()
      expect(iconElement).not.toBeNull()
      expect(iconElement).toHaveAttribute("aria-hidden", "true")
      expect(harness.queryByRole("img")).toBeNull()
    })

    it("exposes non-decorative icon semantics and size tokens", async () => {
      await harness.renderIcon({
        ariaLabel: "Search",
        size: "lg",
        strokeWidth: "lg",
      })

      const iconElement = harness.getByRole("img", { name: /search/i })
      expect(iconElement).toHaveAttribute("width", "40")
      expect(iconElement).toHaveAttribute("height", "40")
      expect(iconElement).toHaveAttribute("stroke-width", "4")
    })
  })
}
