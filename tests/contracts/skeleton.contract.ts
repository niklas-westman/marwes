import { describe, expect, it } from "vitest"

export type SkeletonVariant = "text" | "circular" | "rectangular"
export type SkeletonAnimation = "pulse" | "wave" | "none"

export type SkeletonContractHarness = {
  renderSkeleton(args?: {
    variant?: SkeletonVariant
    width?: number | string
    height?: number | string
    radius?: number | string
    animation?: SkeletonAnimation
    decorative?: boolean
    ariaLabel?: string
    id?: string
  }): Promise<void> | void
  getSkeletonElement(): HTMLElement
  getByRole(role: "status"): HTMLElement
}

export function runSkeletonContract(adapterName: string, harness: SkeletonContractHarness): void {
  describe(`Skeleton contract: ${adapterName}`, () => {
    it("renders a decorative text skeleton by default", async () => {
      await harness.renderSkeleton()

      const skeleton = harness.getSkeletonElement()
      expect(skeleton.tagName).toBe("SPAN")
      expect(skeleton).toHaveAttribute("aria-hidden", "true")
      expect(skeleton.className).toContain("mw-skeleton")
      expect(skeleton).toHaveAttribute("data-variant", "text")
      expect(skeleton).toHaveAttribute("data-animation", "pulse")
      expect(skeleton).toHaveStyle({
        "--mw-skeleton-width": "120px",
        "--mw-skeleton-height": "12px",
        "--mw-skeleton-radius": "4px",
      })
    })

    it("supports circular and rectangular Figma variants", async () => {
      await harness.renderSkeleton({ variant: "circular" })

      const circular = harness.getSkeletonElement()
      expect(circular).toHaveAttribute("data-variant", "circular")
      expect(circular).toHaveStyle({
        "--mw-skeleton-width": "40px",
        "--mw-skeleton-height": "40px",
        "--mw-skeleton-radius": "9999px",
      })
    })

    it("supports accessible status mode, custom dimensions, and wave animation", async () => {
      await harness.renderSkeleton({
        variant: "rectangular",
        width: 240,
        height: "8rem",
        radius: 12,
        animation: "wave",
        ariaLabel: "Loading profile card",
        id: "profile-card-skeleton",
      })

      const skeleton = harness.getByRole("status")
      expect(skeleton).toHaveAttribute("id", "profile-card-skeleton")
      expect(skeleton).toHaveAttribute("aria-label", "Loading profile card")
      expect(skeleton).toHaveAttribute("aria-live", "polite")
      expect(skeleton).toHaveAttribute("data-animation", "wave")
      expect(skeleton.className).toContain("mw-skeleton--wave")
      expect(skeleton).toHaveStyle({
        "--mw-skeleton-width": "240px",
        "--mw-skeleton-height": "8rem",
        "--mw-skeleton-radius": "12px",
      })
    })

    it("supports static skeletons", async () => {
      await harness.renderSkeleton({ animation: "none" })

      const skeleton = harness.getSkeletonElement()
      expect(skeleton).toHaveAttribute("data-animation", "none")
      expect(skeleton.className).not.toContain("mw-skeleton--pulse")
      expect(skeleton.className).not.toContain("mw-skeleton--wave")
    })
  })
}
