import { describe, expect, it } from "vitest"

export type CheckboxContractHarness = {
  renderCheckbox(args?: {
    ariaLabel?: string
    disabled?: boolean
    defaultChecked?: boolean
    indeterminate?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  getByRole(role: "checkbox", options: { name: RegExp }): HTMLInputElement
  click(element: HTMLElement): Promise<void>
}

export function runCheckboxContract(adapterName: string, h: CheckboxContractHarness): void {
  describe(`Checkbox contract: ${adapterName}`, () => {
    it("renders defaultChecked state", async () => {
      await h.renderCheckbox({ ariaLabel: "Subscribe", defaultChecked: true })
      const checkbox = h.getByRole("checkbox", { name: /subscribe/i })
      expect(checkbox).toBeChecked()
    })

    it("calls onCheckedChange with next state", async () => {
      const values: boolean[] = []
      await h.renderCheckbox({
        ariaLabel: "Accept terms",
        onCheckedChange: (checked) => values.push(checked),
      })

      const checkbox = h.getByRole("checkbox", { name: /accept terms/i })
      await h.click(checkbox)

      expect(values).toEqual([true])
      expect(checkbox).toBeChecked()
    })

    it("supports indeterminate DOM state", async () => {
      await h.renderCheckbox({ ariaLabel: "Select all", indeterminate: true })
      const checkbox = h.getByRole("checkbox", { name: /select all/i })
      expect(checkbox.indeterminate).toBe(true)
    })

    it("disabled checkbox does not trigger callbacks", async () => {
      let calls = 0
      await h.renderCheckbox({
        ariaLabel: "Disabled checkbox",
        disabled: true,
        onCheckedChange: () => {
          calls += 1
        },
      })

      const checkbox = h.getByRole("checkbox", { name: /disabled checkbox/i })
      expect(checkbox).toBeDisabled()
      await h.click(checkbox)
      expect(calls).toBe(0)
      expect(checkbox).not.toBeChecked()
    })
  })
}
