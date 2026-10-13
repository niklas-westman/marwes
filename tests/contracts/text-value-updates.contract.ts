import { describe, expect, it } from "vitest"

export interface TextValueUpdatesProps {
  value?: string
  defaultValue?: string
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: string) => void
}
export interface TextValueUpdatesHarness {
  render(props: TextValueUpdatesProps): void | Promise<void>
  rerender(props: TextValueUpdatesProps): void | Promise<void>
  hydrate(props: TextValueUpdatesProps): Promise<string[]>
  getControl(): HTMLElement
  getValue(): string
  setUserValue(value: string): Promise<void>
}
export function runTextValueUpdatesContract(
  adapter: string,
  name: string,
  h: TextValueUpdatesHarness,
  values: { initial: string; updated: string; rawDefault: string },
): void {
  describe(`${name} value updates: ${adapter}`, () => {
    it("updates controlled content without firing a callback", async () => {
      const changes: string[] = []
      const props = { value: values.initial, onValueChange: (value: string) => changes.push(value) }
      await h.render(props)
      expect(h.getValue()).toBe(values.initial)
      await h.rerender({ ...props, value: values.updated })
      expect(h.getValue()).toBe(values.updated)
      expect(changes).toEqual([])
    })
    it("normalizes an uncontrolled default and stays editable after hydration", async () => {
      const changes: string[] = []
      expect(
        await h.hydrate({
          defaultValue: values.rawDefault,
          onValueChange: (value) => changes.push(value),
        }),
      ).toEqual([])
      expect(h.getValue()).toBe(values.initial)
      await h.setUserValue(values.updated)
      expect(changes).toEqual([values.updated])
      expect(h.getValue()).toBe(values.updated)
    })
    for (const flag of ["disabled", "readOnly"] as const) {
      it(`preserves ${flag} and allows editing after re-enabling`, async () => {
        const changes: string[] = []
        const props = {
          value: values.initial,
          onValueChange: (value: string) => changes.push(value),
        }
        expect(await h.hydrate({ ...props, [flag]: true })).toEqual([])
        const control = h.getControl() as HTMLInputElement
        if (flag === "disabled")
          expect(control.disabled || control.getAttribute("aria-disabled") === "true").toBe(true)
        else expect(control.readOnly || control.getAttribute("aria-readonly") === "true").toBe(true)
        await h.setUserValue(values.updated)
        expect(changes).toEqual([])
        await h.rerender(props)
        await h.setUserValue(values.updated)
        expect(changes).toEqual([values.updated])
      })
    }
  })
}
