import { describe, expect, it } from "vitest"

export interface CheckboxGroupUpdatesProps {
  value?: string[]
  defaultValue?: string[]
  disabled?: boolean
  onValueChange?: (values: string[]) => void
}
export interface CheckboxGroupUpdatesHarness {
  render(props: CheckboxGroupUpdatesProps): void | Promise<void>
  rerender(props: CheckboxGroupUpdatesProps): void | Promise<void>
  hydrate(props: CheckboxGroupUpdatesProps): Promise<string[]>
  getCheckbox(label: string): HTMLInputElement
  click(element: HTMLElement): Promise<void>
}
export function runCheckboxGroupUpdatesContract(
  adapter: string,
  h: CheckboxGroupUpdatesHarness,
): void {
  describe(`CheckboxGroup state updates: ${adapter}`, () => {
    it("reflects a controlled selection without firing a callback", async () => {
      const changes: string[][] = []
      const props = { value: ["email"], onValueChange: (values: string[]) => changes.push(values) }
      await h.render(props)
      expect(h.getCheckbox("Email")).toBeChecked()
      expect(h.getCheckbox("SMS")).not.toBeChecked()
      await h.rerender({ ...props, value: ["sms"] })
      expect(h.getCheckbox("SMS")).toBeChecked()
      expect(h.getCheckbox("Email")).not.toBeChecked()
      expect(changes).toEqual([])
    })
    it("hydrates an uncontrolled default, respects group/optionsdisabled and re-enables", async () => {
      const changes: string[][] = []
      const props = {
        defaultValue: ["sms"],
        onValueChange: (values: string[]) => changes.push(values),
      }
      expect(await h.hydrate(props)).toEqual([])
      expect(h.getCheckbox("SMS")).toBeChecked()
      expect(h.getCheckbox("Disabled option")).toBeDisabled()
      await h.click(h.getCheckbox("Disabled option"))
      expect(changes).toEqual([])
      await h.click(h.getCheckbox("Email"))
      expect(changes).toEqual([["email", "sms"]])
      await h.rerender({ ...props, disabled: true })
      expect(h.getCheckbox("Email")).toBeDisabled()
      await h.click(h.getCheckbox("Email"))
      expect(changes).toHaveLength(1)
      await h.rerender(props)
      await h.click(h.getCheckbox("Email"))
      expect(changes).toEqual([["email", "sms"], ["sms"]])
    })
  })
}
