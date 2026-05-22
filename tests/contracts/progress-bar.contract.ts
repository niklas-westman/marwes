/**
 * Shared contract for the ProgressBar atom — determinate progress semantics,
 * Figma small/default track sizes, label/percentage visibility, and disabled styling metadata.
 */
import { describe, expect, it } from "vitest"

export type ProgressBarSize = "small" | "default"
export type ProgressBarState = "default" | "hover" | "pressed" | "focus"

export type ProgressBarContractHarness = {
  renderProgressBar(args?: {
    id?: string
    label?: string
    value?: number
    min?: number
    max?: number
    size?: ProgressBarSize
    state?: ProgressBarState
    disabled?: boolean
    showLabel?: boolean
    showPercentage?: boolean
    valueLabel?: string
    ariaLabel?: string
  }): Promise<void> | void
  getProgressBarElement(): HTMLElement
}

export function runProgressBarContract(
  adapterName: string,
  harness: ProgressBarContractHarness,
): void {
  describe(`ProgressBar contract: ${adapterName}`, () => {
    it("renders determinate progress semantics and Figma percentage fill", async () => {
      await harness.renderProgressBar({ id: "import-progress", label: "Import", value: 60 })

      const progressBar = harness.getProgressBarElement()
      expect(progressBar).toHaveAttribute("role", "progressbar")
      expect(progressBar).toHaveAttribute("aria-valuemin", "0")
      expect(progressBar).toHaveAttribute("aria-valuemax", "100")
      expect(progressBar).toHaveAttribute("aria-valuenow", "60")
      expect(progressBar).toHaveAttribute("aria-labelledby", "import-progress-label")
      expect(progressBar).toHaveAttribute("data-component", "progress-bar")
      expect(progressBar).toHaveAttribute("data-size", "default")
      expect(progressBar).toHaveStyle({ "--mw-progress-bar-value-percentage": "60%" })
      expect(progressBar.textContent).toContain("Import")
      expect(progressBar.textContent).toContain("60%")
    })

    it("clamps values and supports custom bounds", async () => {
      await harness.renderProgressBar({ value: 150, min: 50, max: 125 })

      const progressBar = harness.getProgressBarElement()
      expect(progressBar).toHaveAttribute("aria-valuemin", "50")
      expect(progressBar).toHaveAttribute("aria-valuemax", "125")
      expect(progressBar).toHaveAttribute("aria-valuenow", "125")
      expect(progressBar).toHaveStyle({ "--mw-progress-bar-value-percentage": "100%" })
    })

    it("supports the small 4px dashboard size and hidden visible text", async () => {
      await harness.renderProgressBar({
        value: 24,
        size: "small",
        showLabel: false,
        showPercentage: false,
        ariaLabel: "Upload progress",
      })

      const progressBar = harness.getProgressBarElement()
      expect(progressBar).toHaveAttribute("aria-label", "Upload progress")
      expect(progressBar).toHaveAttribute("data-size", "small")
      expect(progressBar.className).toContain("mw-progress-bar--small")
      expect(progressBar.textContent).not.toContain("Progress")
      expect(progressBar.textContent).not.toContain("24%")
    })

    it("supports disabled and visual state metadata", async () => {
      await harness.renderProgressBar({
        value: 60,
        disabled: true,
        state: "pressed",
        valueLabel: "60 of 100 steps complete",
      })

      const progressBar = harness.getProgressBarElement()
      expect(progressBar).toHaveAttribute("aria-disabled", "true")
      expect(progressBar).toHaveAttribute("aria-valuetext", "60 of 100 steps complete")
      expect(progressBar).toHaveAttribute("data-disabled", "true")
      expect(progressBar).toHaveAttribute("data-state", "pressed")
      expect(progressBar.className).toContain("mw-progress-bar--disabled")
      expect(progressBar.className).toContain("mw-progress-bar--state-pressed")
    })
  })
}
