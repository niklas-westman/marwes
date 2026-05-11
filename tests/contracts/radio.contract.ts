/**
 * Shared contract for the Radio atom — defaultChecked state,
 * onCheckedChange callback, and disabled suppression.
 */
import { describe, expect, it } from "vitest"

export type RadioContractHarness = {
  renderRadio(args?: {
    ariaLabel?: string
    disabled?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void> | void
  getByRole(role: "radio", options: { name: RegExp }): HTMLInputElement
  click(element: HTMLElement): Promise<void>
}

export function runRadioContract(adapterName: string, h: RadioContractHarness): void {
  describe(`Radio contract: ${adapterName}`, () => {
    it("renders defaultChecked state", async () => {
      await h.renderRadio({ ariaLabel: "Option A", defaultChecked: true })
      const radio = h.getByRole("radio", { name: /option a/i })
      expect(radio).toBeChecked()
    })

    it("calls onCheckedChange with true when clicked", async () => {
      const values: boolean[] = []
      await h.renderRadio({
        ariaLabel: "Option A",
        onCheckedChange: (checked) => values.push(checked),
      })

      const radio = h.getByRole("radio", { name: /option a/i })
      await h.click(radio)

      expect(values).toEqual([true])
      expect(radio).toBeChecked()
    })

    it("disabled radio does not trigger callbacks", async () => {
      let calls = 0
      await h.renderRadio({
        ariaLabel: "Disabled radio",
        disabled: true,
        onCheckedChange: () => {
          calls += 1
        },
      })

      const radio = h.getByRole("radio", { name: /disabled radio/i })
      expect(radio).toBeDisabled()
      await h.click(radio)
      expect(calls).toBe(0)
      expect(radio).not.toBeChecked()
    })
  })
}
