/**
 * Shared contract for RadioGroupField — labeled radiogroup,
 * uncontrolled/controlled value switching, shared group name, description, and error wiring.
 */
import { describe, expect, it } from "vitest"

export type RadioGroupFieldOptionContract = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export type RadioGroupFieldContractHarness = {
  renderRadioGroup(args?: {
    name?: string
    label?: string
    description?: string
    error?: string
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    required?: boolean
    ariaDescribedBy?: string
    options?: RadioGroupFieldOptionContract[]
  }): Promise<void> | void
  getByRole(role: "radiogroup" | "radio", options?: { name?: RegExp | string }): HTMLElement
  getAllByRole(role: "radio"): HTMLInputElement[]
  getByText(text: string): HTMLElement
  click(element: HTMLElement): Promise<void>
}

const defaultOptions: RadioGroupFieldOptionContract[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
]

const mixedOptions: RadioGroupFieldOptionContract[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta", disabled: true },
  { value: "c", label: "Gamma" },
]

export function runRadioGroupFieldContract(
  adapterName: string,
  harness: RadioGroupFieldContractHarness,
): void {
  describe(`RadioGroupField contract: ${adapterName}`, () => {
    it("renders a labeled radiogroup with radio options", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
      })

      expect(harness.getByRole("radiogroup", { name: /pick one/i })).toBeInTheDocument()
      expect(harness.getAllByRole("radio")).toHaveLength(3)
    })

    it("renders option labels with the canonical radio option typography", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
      })

      const optionLabelText = harness.getByText("Alpha")

      expect(optionLabelText).toHaveClass("mw-text")
      expect(optionLabelText).toHaveClass("mw-text--label")
    })

    it("renders the group label with the canonical radio label typography", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
      })

      const groupLabelText = harness.getByText("Pick one")

      expect(groupLabelText).toHaveClass("mw-text")
      expect(groupLabelText).toHaveClass("mw-text--label")
    })

    it("renders the group description with the canonical helper typography", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        description: "Choose your favorite",
        options: defaultOptions,
      })

      const descriptionText = harness.getByText("Choose your favorite")

      expect(descriptionText).toHaveClass("mw-text")
      expect(descriptionText).toHaveClass("mw-text--caption")
    })

    it("renders option descriptions with the canonical small label typography", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: [{ value: "a", label: "Alpha", description: "Primary option" }],
      })

      const optionDescriptionText = harness.getByText("Primary option")

      expect(optionDescriptionText).toHaveClass("mw-text")
      expect(optionDescriptionText).toHaveClass("mw-text--label-small")
      expect(harness.getByRole("radio", { name: /alpha/i })).toHaveAccessibleDescription(
        "Primary option",
      )
    })

    it("uncontrolled: applies defaultValue and switches selection", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
        defaultValue: "a",
      })

      const alphaRadio = harness.getByRole("radio", { name: /alpha/i }) as HTMLInputElement
      const betaRadio = harness.getByRole("radio", { name: /beta/i }) as HTMLInputElement

      expect(alphaRadio).toBeChecked()
      expect(betaRadio).not.toBeChecked()

      await harness.click(betaRadio)

      expect(betaRadio).toBeChecked()
      expect(alphaRadio).not.toBeChecked()
    })

    it("controlled: emits the next value when a different option is clicked", async () => {
      const values: string[] = []

      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
        value: "a",
        onValueChange: (value) => {
          values.push(value)
        },
      })

      await harness.click(harness.getByRole("radio", { name: /beta/i }))

      expect(values.length).toBeGreaterThan(0)
      expect(values.every((value) => value === "b")).toBe(true)
    })

    it("applies the shared group name to all radios", async () => {
      await harness.renderRadioGroup({
        name: "shipping-method",
        label: "Pick one",
        options: defaultOptions,
      })

      for (const radio of harness.getAllByRole("radio")) {
        expect(radio.name).toBe("shipping-method")
      }
    })

    it("wires description into aria-describedby", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        description: "Choose your favorite",
        options: defaultOptions,
      })

      const group = harness.getByRole("radiogroup", { name: /pick one/i })
      const descriptionTextNode = harness.getByText("Choose your favorite")
      const descriptionElement = descriptionTextNode.closest("[id]") as HTMLElement | null
      const describedBy = group.getAttribute("aria-describedby") ?? ""

      expect(descriptionElement).not.toBeNull()
      expect(descriptionElement?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(descriptionElement?.id ?? "")
    })

    it("merges external describedBy with internal description and error ids", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        description: "Choose your favorite",
        error: "Selection required",
        ariaDescribedBy: "external-help",
        options: defaultOptions,
      })

      const group = harness.getByRole("radiogroup", { name: /pick one/i })
      const describedByIds = (group.getAttribute("aria-describedby") ?? "").split(/\s+/)
      const descriptionElement = harness
        .getByText("Choose your favorite")
        .closest("[id]") as HTMLElement | null
      const errorElement = harness
        .getByText("Selection required")
        .closest("[id]") as HTMLElement | null

      expect(describedByIds).toContain("external-help")
      expect(describedByIds).toContain(descriptionElement?.id ?? "")
      expect(describedByIds).toContain(errorElement?.id ?? "")
    })

    it("shows error, marks the group invalid, and propagates invalid state to radios", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        error: "Selection required",
        options: defaultOptions,
      })

      const group = harness.getByRole("radiogroup", { name: /pick one/i })
      expect(group).toHaveAttribute("aria-invalid", "true")

      for (const radio of harness.getAllByRole("radio")) {
        expect(radio).toHaveAttribute("aria-invalid", "true")
      }

      const errorElement = harness.getByText("Selection required").closest('[aria-live="polite"]')
      expect(errorElement).not.toBeNull()
    })

    it("treats empty description and error text as absent", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        description: "",
        error: "",
        ariaDescribedBy: "external-help",
        options: defaultOptions,
      })

      const group = harness.getByRole("radiogroup", { name: /pick one/i })

      expect(group).toHaveAttribute("aria-describedby", "external-help")
      expect(group).not.toHaveAttribute("aria-invalid", "true")
    })

    it("disabled group disables all child radios", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
        disabled: true,
      })

      for (const radio of harness.getAllByRole("radio")) {
        expect(radio).toBeDisabled()
      }
    })

    it("required prop sets aria-required on the radiogroup", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: defaultOptions,
        required: true,
      })

      const group = harness.getByRole("radiogroup", { name: /pick one/i })
      expect(group).toHaveAttribute("aria-required", "true")
    })

    it("per-option disabled disables only that option", async () => {
      await harness.renderRadioGroup({
        label: "Pick one",
        options: mixedOptions,
      })

      const alphaRadio = harness.getByRole("radio", { name: /alpha/i })
      const betaRadio = harness.getByRole("radio", { name: /beta/i })
      const gammaRadio = harness.getByRole("radio", { name: /gamma/i })

      expect(alphaRadio).not.toBeDisabled()
      expect(betaRadio).toBeDisabled()
      expect(gammaRadio).not.toBeDisabled()
    })
  })
}
