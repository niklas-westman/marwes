/**
 * Shared contract for Banner component — verifies cross-adapter behavioral parity
 * for variant rendering, a11y roles, icon/dismiss/action visibility, and dismiss interaction.
 */
import { describe, expect, it } from "vitest"

export interface BannerContractHarness {
  renderDefault(): Promise<void> | void
  renderInfo(): Promise<void> | void
  renderWarning(): Promise<void> | void
  renderError(): Promise<void> | void
  renderWithoutIcon(): Promise<void> | void
  renderNonDismissible(): Promise<void> | void
  renderWithAction(): Promise<void> | void
  renderWithAriaLabel(): Promise<void> | void
  clickDismiss(): Promise<void> | void
  getByRole(role: string, options?: { name?: string | RegExp }): HTMLElement
  getByText(text: string): HTMLElement
  queryByRole(role: string, options?: { name?: string | RegExp }): HTMLElement | null
  getRoot(): HTMLElement
  getDismissHandler(): { called: boolean }
}

export function runBannerContract(adapterName: string, harness: BannerContractHarness): void {
  describe(`Banner contract: ${adapterName}`, () => {
    it("defaults to neutral variant with role=status and polite live region", async () => {
      await harness.renderDefault()

      const root = harness.getByRole("status")
      expect(root).toHaveAttribute("data-component", "banner")
      expect(root).toHaveAttribute("data-variant", "neutral")
      expect(root).toHaveAttribute("aria-live", "polite")
    })

    it("info variant uses role=status with polite live region", async () => {
      await harness.renderInfo()

      const root = harness.getByRole("status")
      expect(root).toHaveAttribute("data-variant", "info")
      expect(root).toHaveAttribute("aria-live", "polite")
    })

    it("warning variant uses role=alert with assertive live region", async () => {
      await harness.renderWarning()

      const root = harness.getByRole("alert")
      expect(root).toHaveAttribute("data-variant", "warning")
      expect(root).toHaveAttribute("aria-live", "assertive")
    })

    it("error variant uses role=alert with assertive live region", async () => {
      await harness.renderError()

      const root = harness.getByRole("alert")
      expect(root).toHaveAttribute("data-variant", "error")
      expect(root).toHaveAttribute("aria-live", "assertive")
    })

    it("renders icon by default", async () => {
      await harness.renderDefault()

      const root = harness.getRoot()
      const icon = root.querySelector(".mw-banner__icon")
      expect(icon).not.toBeNull()
    })

    it("hides icon when showIcon is false", async () => {
      await harness.renderWithoutIcon()

      const root = harness.getRoot()
      const icon = root.querySelector(".mw-banner__icon")
      expect(icon).toBeNull()
    })

    it("renders dismiss button by default with accessible name", async () => {
      await harness.renderDefault()

      const dismiss = harness.getByRole("button", { name: /dismiss/i })
      expect(dismiss).not.toBeNull()
    })

    it("hides dismiss button when non-dismissible", async () => {
      await harness.renderNonDismissible()

      const dismiss = harness.queryByRole("button", { name: /dismiss/i })
      expect(dismiss).toBeNull()
    })

    it("renders action slot when provided", async () => {
      await harness.renderWithAction()

      const root = harness.getRoot()
      const action = root.querySelector(".mw-banner__action")
      expect(action).not.toBeNull()
      expect(harness.getByText("Learn more")).not.toBeNull()
    })

    it("calls dismiss handler on close button click", async () => {
      await harness.renderDefault()
      await harness.clickDismiss()

      const handler = harness.getDismissHandler()
      expect(handler.called).toBe(true)
    })

    it("sets aria-label when provided", async () => {
      await harness.renderWithAriaLabel()

      const root = harness.getRoot()
      expect(root).toHaveAttribute("aria-label", "Important notice")
    })
  })
}
