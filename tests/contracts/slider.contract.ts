import { describe, expect, it } from "vitest"

export type SliderContractHarness = {
  renderSlider(args?: {
    ariaLabel?: string
    min?: number
    max?: number
    step?: number
    value?: number
    defaultValue?: number
    disabled?: boolean
    showTooltip?: boolean
    ariaValueText?: string
    onValueChange?: (value: number) => void
  }): Promise<void> | void
  renderSliderField(args: {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    min?: number
    max?: number
    step?: number
    value?: number
    defaultValue?: number
    disabled?: boolean
    showTooltip?: boolean
    ariaValueText?: string
    onValueChange?: (value: number) => void
  }): Promise<void> | void
  getByRole(role: "slider", options: { name: RegExp | string }): HTMLElement
  getByText(text: string): HTMLElement
  queryDescriptionRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  changeValue(element: HTMLElement, nextValue: string): Promise<void>
}

export function runSliderContract(adapterName: string, harness: SliderContractHarness): void {
  describe(`Slider contract: ${adapterName}`, () => {
    it("renders a native range slider with the expected value metadata", async () => {
      await harness.renderSlider({
        ariaLabel: "Volume",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 25,
        ariaValueText: "25 percent",
      })

      const slider = harness.getByRole("slider", { name: /volume/i }) as HTMLInputElement

      expect(slider).toHaveAttribute("type", "range")
      expect(slider).toHaveAttribute("min", "0")
      expect(slider).toHaveAttribute("max", "100")
      expect(slider).toHaveAttribute("step", "5")
      expect(slider).toHaveAttribute("aria-valuetext", "25 percent")
      expect(slider.value).toBe("25")
    })

    it("updates uncontrolled slider value and emits numeric onValueChange", async () => {
      const emittedValues: number[] = []

      await harness.renderSlider({
        ariaLabel: "Opacity",
        defaultValue: 24,
        onValueChange: (value) => {
          emittedValues.push(value)
        },
      })

      const slider = harness.getByRole("slider", { name: /opacity/i }) as HTMLInputElement
      await harness.changeValue(slider, "32")

      expect(emittedValues).toContain(32)
      expect(slider.value).toBe("32")
    })

    it("keeps the controlled value as source of truth while still emitting the next value", async () => {
      const emittedValues: number[] = []

      await harness.renderSlider({
        ariaLabel: "Radius",
        value: 24,
        onValueChange: (value) => {
          emittedValues.push(value)
        },
      })

      const slider = harness.getByRole("slider", { name: /radius/i }) as HTMLInputElement
      await harness.changeValue(slider, "32")

      const rerenderedSlider = harness.getByRole("slider", { name: /radius/i }) as HTMLInputElement

      expect(emittedValues).toContain(32)
      expect(rerenderedSlider.value).toBe("24")
    })

    it("preserves disabled native slider semantics", async () => {
      await harness.renderSlider({
        ariaLabel: "Locked radius",
        defaultValue: 24,
        disabled: true,
      })

      const slider = harness.getByRole("slider", { name: /locked radius/i })

      expect(slider).toBeDisabled()
    })

    it("shows the current numeric tooltip when showTooltip is enabled", async () => {
      await harness.renderSlider({
        ariaLabel: "Brightness",
        defaultValue: 80,
        showTooltip: true,
      })

      const tooltip = harness.getByText("80")

      expect(tooltip.closest(".mw-slider__tooltip")).not.toBeNull()
      expect(tooltip.closest(".mw-slider__tooltip")).toHaveAttribute("aria-hidden", "true")
    })

    it("wires the visible field label and description to the slider", async () => {
      await harness.renderSliderField({
        label: "Volume",
        description: "Adjust the output level.",
        defaultValue: 40,
      })

      const slider = harness.getByRole("slider", { name: /volume/i })
      const descriptionTextNode = harness.getByText("Adjust the output level.")
      const description = harness.queryDescriptionRegion()
      const describedBy = slider.getAttribute("aria-describedby") ?? ""

      expect(descriptionTextNode).toBeInTheDocument()
      expect(slider).toHaveAttribute("aria-labelledby")
      expect(slider).not.toHaveAttribute("aria-label", "Volume")
      expect(description).not.toBeNull()
      expect(description?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(description?.id ?? "")
    })

    it("merges external describedBy with error text and marks the slider invalid", async () => {
      await harness.renderSliderField({
        label: "Temperature",
        error: "Select a value within the allowed range.",
        ariaDescribedBy: "external-help",
        defaultValue: 50,
      })

      const slider = harness.getByRole("slider", { name: /temperature/i })
      const errorTextNode = harness.getByText("Select a value within the allowed range.")
      const error = harness.queryErrorRegion()
      const describedBy = slider.getAttribute("aria-describedby") ?? ""

      expect(errorTextNode).toBeInTheDocument()
      expect(slider).toHaveAttribute("aria-invalid", "true")
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain("external-help")
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
    })

    it("treats empty description and error text as absent", async () => {
      await harness.renderSliderField({
        label: "Volume",
        description: "",
        error: "",
        ariaDescribedBy: "external-help",
        defaultValue: 40,
      })

      const slider = harness.getByRole("slider", { name: /volume/i })

      expect(slider).toHaveAttribute("aria-describedby", "external-help")
      expect(slider).not.toHaveAttribute("aria-invalid", "true")
      expect(harness.queryDescriptionRegion()).toBeNull()
      expect(harness.queryErrorRegion()).toBeNull()
    })
  })
}
