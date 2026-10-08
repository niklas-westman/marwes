/**
 * Shared contract for on/off controls (Checkbox, Switch) — controlled checked updates,
 * disabled-state changes and a server-rendered checked state surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface ToggleUpdatesProps {
  ariaLabel: string
  checked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface ToggleUpdatesHarness {
  render(props: ToggleUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted control with new props and flushes updates. */
  rerender(props: ToggleUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: ToggleUpdatesProps): Promise<string[]>
  getControl(): HTMLElement
  isChecked(control: HTMLElement): boolean
  click(element: HTMLElement): Promise<void>
}

const ariaLabel = "Notifications"

export function runToggleUpdatesContract(
  adapterName: string,
  controlName: string,
  h: ToggleUpdatesHarness,
): void {
  describe(`${controlName} updates contract: ${adapterName}`, () => {
    it("reflects a controlled checked update without reporting a change", async () => {
      const changes: boolean[] = []
      const onCheckedChange = (checked: boolean): void => {
        changes.push(checked)
      }

      await h.render({ ariaLabel, checked: false, onCheckedChange })
      expect(h.isChecked(h.getControl())).toBe(false)

      await h.rerender({ ariaLabel, checked: true, onCheckedChange })
      expect(h.isChecked(h.getControl())).toBe(true)

      await h.rerender({ ariaLabel, checked: false, onCheckedChange })
      expect(h.isChecked(h.getControl())).toBe(false)
      expect(changes).toEqual([])
    })

    it("blocks changes while disabled and restores them when re-enabled", async () => {
      const changes: boolean[] = []
      const onCheckedChange = (checked: boolean): void => {
        changes.push(checked)
      }

      await h.render({ ariaLabel, checked: false, disabled: false, onCheckedChange })
      await h.click(h.getControl())
      expect(changes).toEqual([true])

      await h.rerender({ ariaLabel, checked: false, disabled: true, onCheckedChange })
      await h.click(h.getControl())
      expect(changes).toEqual([true])

      await h.rerender({ ariaLabel, checked: false, disabled: false, onCheckedChange })
      await h.click(h.getControl())
      expect(changes).toHaveLength(2)
    })

    it("keeps the server-rendered checked state and stays interactive after hydration", async () => {
      const changes: boolean[] = []
      const issues = await h.hydrate({
        ariaLabel,
        checked: true,
        onCheckedChange: (checked) => changes.push(checked),
      })

      expect(issues).toEqual([])
      expect(h.isChecked(h.getControl())).toBe(true)

      await h.click(h.getControl())
      expect(changes).toEqual([false])
    })

    it("hydrates a disabled control as disabled with its state intact", async () => {
      const issues = await h.hydrate({ ariaLabel, checked: true, disabled: true })

      expect(issues).toEqual([])
      expect(h.isChecked(h.getControl())).toBe(true)
      expect(
        h.getControl().hasAttribute("disabled") || h.getControl().ariaDisabled === "true",
      ).toBe(true)
    })
  })
}
