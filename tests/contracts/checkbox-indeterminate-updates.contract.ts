import { describe, expect, it } from "vitest"

export interface CheckboxIndeterminateProps {
  ariaLabel: string
  checked: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface CheckboxIndeterminateHarness {
  render(props: CheckboxIndeterminateProps): Promise<void> | void
  rerender(props: CheckboxIndeterminateProps): Promise<void> | void
  hydrate(props: CheckboxIndeterminateProps): Promise<string[]>
  getCheckbox(): HTMLInputElement
}

export function runCheckboxIndeterminateUpdatesContract(
  adapter: string,
  h: CheckboxIndeterminateHarness,
): void {
  describe(`Checkbox indeterminate updates: ${adapter}`, () => {
    const base = { ariaLabel: "Select all", checked: false }

    it("adds and removes the mixed state without reporting a checked change", async () => {
      const changes: boolean[] = []
      const props = { ...base, onCheckedChange: (checked: boolean) => changes.push(checked) }
      await h.render(props)
      expect(h.getCheckbox().indeterminate).toBe(false)
      await h.rerender({ ...props, indeterminate: true })
      expect(h.getCheckbox().indeterminate).toBe(true)
      expect(h.getCheckbox()).toHaveAttribute("aria-checked", "mixed")
      await h.rerender(props)
      expect(h.getCheckbox().indeterminate).toBe(false)
      expect(h.getCheckbox()).not.toHaveAttribute("aria-checked", "mixed")
      expect(changes).toEqual([])
    })

    it("restores the native indeterminate property and mixed ARIA state during hydration", async () => {
      const changes: boolean[] = []
      expect(
        await h.hydrate({
          ...base,
          indeterminate: true,
          onCheckedChange: (checked) => changes.push(checked),
        }),
      ).toEqual([])
      expect(h.getCheckbox().indeterminate).toBe(true)
      expect(h.getCheckbox()).toHaveAttribute("aria-checked", "mixed")
      expect(h.getCheckbox().checked).toBe(false)
      expect(changes).toEqual([])
    })
  })
}
