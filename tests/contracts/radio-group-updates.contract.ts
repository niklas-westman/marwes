/**
 * Shared contract for the options-driven radio group (RadioGroupField in React and Vue,
 * OptionRadioGroup in Svelte) — controlled value updates, disabled-state changes and a
 * server-rendered selection surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface RadioGroupUpdatesProps {
  name: string
  label: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface RadioGroupUpdatesHarness {
  render(props: RadioGroupUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted group with new props and flushes updates. */
  rerender(props: RadioGroupUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: RadioGroupUpdatesProps): Promise<string[]>
  getRadio(label: string): HTMLInputElement
  getAllRadios(): HTMLInputElement[]
  click(element: HTMLElement): Promise<void>
}

const base = { name: "plan", label: "Plan" }
const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "scale", label: "Scale" },
]

function checkedValues(h: RadioGroupUpdatesHarness): string[] {
  return h
    .getAllRadios()
    .filter((radio) => radio.checked)
    .map((radio) => radio.value)
}

export function runRadioGroupUpdatesContract(
  adapterName: string,
  h: RadioGroupUpdatesHarness,
): void {
  describe(`RadioGroupField updates contract: ${adapterName}`, () => {
    it("moves the checked radio on a controlled update without reporting a change", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ...base, options, value: "starter", onValueChange })
      expect(checkedValues(h)).toEqual(["starter"])

      await h.rerender({ ...base, options, value: "scale", onValueChange })

      expect(checkedValues(h)).toEqual(["scale"])
      expect(changes).toEqual([])
    })

    it("disables every radio while disabled and restores selection when re-enabled", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ...base, options, value: "starter", disabled: true, onValueChange })
      for (const radio of h.getAllRadios()) {
        expect(radio).toBeDisabled()
      }
      await h.click(h.getRadio("Growth"))
      expect(changes).toEqual([])

      await h.rerender({ ...base, options, value: "starter", disabled: false, onValueChange })
      await h.click(h.getRadio("Growth"))
      expect(changes).toEqual(["growth"])
    })

    it("keeps the server-rendered selection and stays interactive after hydration", async () => {
      const changes: string[] = []
      const issues = await h.hydrate({
        ...base,
        options,
        value: "growth",
        onValueChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expect(checkedValues(h)).toEqual(["growth"])

      await h.click(h.getRadio("Scale"))
      expect(changes).toEqual(["scale"])
    })
  })
}
