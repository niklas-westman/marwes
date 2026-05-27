/**
 * Shared contract for the Switch atom — aria-checked reflection,
 * onCheckedChange callback, disabled suppression, and label wiring via aria-labelledby.
 */
import { describe, expect, it } from "vitest"

export type SwitchContractHarness = {
  renderSwitch(args?: {
    ariaLabel?: string
    checked?: boolean
    disabled?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  renderSwitchField(args: {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  getByRole(role: "switch", options: { name: RegExp }): HTMLElement
  getByText(text: string): HTMLElement
  queryDescriptionRegion(): HTMLElement | null
  queryErrorRegion(): HTMLElement | null
  click(element: HTMLElement): Promise<void>
}

export function runSwitchContract(adapterName: string, harness: SwitchContractHarness): void {
  describe(`Switch contract: ${adapterName}`, () => {
    it("reflects checked state through aria-checked", async () => {
      await harness.renderSwitch({
        ariaLabel: "Email notifications",
        checked: true,
      })

      const switchControl = harness.getByRole("switch", { name: /email notifications/i })

      expect(switchControl.tagName).toBe("BUTTON")
      expect(switchControl).toHaveAttribute("aria-checked", "true")
    })

    it("calls onCheckedChange with the next state when clicked", async () => {
      const values: boolean[] = []

      await harness.renderSwitch({
        ariaLabel: "Enable sync",
        onCheckedChange: (checked) => {
          values.push(checked)
        },
      })

      const switchControl = harness.getByRole("switch", { name: /enable sync/i })
      await harness.click(switchControl)

      expect(values).toEqual([true])
      expect(switchControl).toHaveAttribute("aria-checked", "false")
    })

    it("disabled switch does not trigger callbacks", async () => {
      let calls = 0

      await harness.renderSwitch({
        ariaLabel: "Disabled switch",
        disabled: true,
        onCheckedChange: () => {
          calls += 1
        },
      })

      const switchControl = harness.getByRole("switch", { name: /disabled switch/i })

      expect(switchControl).toBeDisabled()
      expect(switchControl).toHaveAttribute("aria-disabled", "true")

      await harness.click(switchControl)

      expect(calls).toBe(0)
      expect(switchControl).toHaveAttribute("aria-checked", "false")
    })

    it("wires the visible field label through aria-labelledby", async () => {
      await harness.renderSwitchField({
        label: "Enable notifications",
      })

      const switchControl = harness.getByRole("switch", { name: /enable notifications/i })
      const labelTextNode = harness.getByText("Enable notifications")
      const labelElement = labelTextNode.closest(".mw-switch-field__label")
      const labelledBy = switchControl.getAttribute("aria-labelledby") ?? ""

      expect(labelTextNode).toHaveClass("mw-text", "mw-text--label")
      expect(labelElement).not.toBeNull()
      expect(labelElement?.id).toBeTruthy()
      expect(labelledBy.split(/\s+/)).toContain(labelElement?.id ?? "")
      expect(switchControl).not.toHaveAttribute("aria-label", "Enable notifications")
    })

    it("connects description text through aria-describedby", async () => {
      await harness.renderSwitchField({
        label: "Require review before publishing",
        description: "Review mode protects production content.",
      })

      const switchControl = harness.getByRole("switch", {
        name: /require review before publishing/i,
      })
      const descriptionTextNode = harness.getByText("Review mode protects production content.")
      const description = harness.queryDescriptionRegion()
      const describedBy = switchControl.getAttribute("aria-describedby") ?? ""

      expect(descriptionTextNode).toBeInTheDocument()
      expect(descriptionTextNode).toHaveClass("mw-text", "mw-text--caption")
      expect(description).not.toBeNull()
      expect(description?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(description?.id ?? "")
    })

    it("connects error text through aria-describedby", async () => {
      await harness.renderSwitchField({
        label: "Workspace lock",
        error: "Workspace lock must remain enabled.",
      })

      const switchControl = harness.getByRole("switch", { name: /workspace lock/i })
      const errorTextNode = harness.getByText("Workspace lock must remain enabled.")
      const error = harness.queryErrorRegion()
      const describedBy = switchControl.getAttribute("aria-describedby") ?? ""

      expect(errorTextNode).toBeInTheDocument()
      expect(errorTextNode).toHaveClass("mw-text", "mw-text--caption")
      expect(error).not.toBeNull()
      expect(error?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(error?.id ?? "")
      expect(switchControl).not.toHaveAttribute("aria-invalid", "true")
    })

    it("treats empty description and error text as absent", async () => {
      await harness.renderSwitchField({
        label: "Marketing emails",
        description: "",
        error: "",
        ariaDescribedBy: "external-help",
      })

      const switchControl = harness.getByRole("switch", { name: /marketing emails/i })

      expect(switchControl).toHaveAttribute("aria-describedby", "external-help")
      expect(harness.queryDescriptionRegion()).toBeNull()
      expect(harness.queryErrorRegion()).toBeNull()
    })
  })
}
