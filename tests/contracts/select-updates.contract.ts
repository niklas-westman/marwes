/**
 * Shared contract for Select transitions — controlled value updates, disabled-state changes and
 * a server-rendered selection surviving hydration. Complements select.contract.ts, which only
 * renders once.
 */
import { describe, expect, it } from "vitest"

export interface SelectUpdatesProps {
  ariaLabel: string
  options: Array<{ value: string; label: string }>
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface SelectUpdatesHarness {
  render(props: SelectUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted Select with new props and flushes updates. */
  rerender(props: SelectUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: SelectUpdatesProps): Promise<string[]>
  getSelect(): HTMLSelectElement
  selectOption(element: HTMLElement, value: string): Promise<void>
}

const ariaLabel = "Plan"
const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "scale", label: "Scale" },
]

export function runSelectUpdatesContract(adapterName: string, h: SelectUpdatesHarness): void {
  describe(`Select updates contract: ${adapterName}`, () => {
    it("reflects a controlled value update without reporting a change", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, options, value: "starter", onValueChange })
      expect(h.getSelect()).toHaveValue("starter")

      await h.rerender({ ariaLabel, options, value: "scale", onValueChange })

      expect(h.getSelect()).toHaveValue("scale")
      expect(changes).toEqual([])
    })

    it("keeps the selection when disabled changes and blocks changes while disabled", async () => {
      await h.render({ ariaLabel, options, value: "growth", disabled: false })
      expect(h.getSelect()).toBeEnabled()

      await h.rerender({ ariaLabel, options, value: "growth", disabled: true })
      expect(h.getSelect()).toBeDisabled()
      expect(h.getSelect()).toHaveValue("growth")

      await h.rerender({ ariaLabel, options, value: "growth", disabled: false })
      expect(h.getSelect()).toBeEnabled()
      expect(h.getSelect()).toHaveValue("growth")
    })

    it("keeps the server-rendered selection and stays interactive after hydration", async () => {
      const changes: string[] = []
      const issues = await h.hydrate({
        ariaLabel,
        options,
        value: "growth",
        onValueChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expect(h.getSelect()).toHaveValue("growth")
      expect(h.getSelect().selectedOptions[0]).toHaveTextContent("Growth")

      await h.selectOption(h.getSelect(), "scale")
      expect(changes).toEqual(["scale"])
    })

    it("hydrates a disabled select as disabled with its selection intact", async () => {
      const issues = await h.hydrate({ ariaLabel, options, value: "scale", disabled: true })

      expect(issues).toEqual([])
      expect(h.getSelect()).toBeDisabled()
      expect(h.getSelect()).toHaveValue("scale")
    })
  })
}
