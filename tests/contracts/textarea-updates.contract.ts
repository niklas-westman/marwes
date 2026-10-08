/**
 * Shared contract for Textarea transitions — controlled value updates, disabled-state changes and
 * server-rendered text surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface TextareaUpdatesProps {
  ariaLabel: string
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface TextareaUpdatesHarness {
  render(props: TextareaUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted Textarea with new props and flushes updates. */
  rerender(props: TextareaUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: TextareaUpdatesProps): Promise<string[]>
  getTextbox(): HTMLTextAreaElement
  type(element: HTMLElement, text: string): Promise<void>
}

const ariaLabel = "Notes"

export function runTextareaUpdatesContract(adapterName: string, h: TextareaUpdatesHarness): void {
  describe(`Textarea updates contract: ${adapterName}`, () => {
    it("reflects a controlled value update without reporting a change", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, value: "first", onValueChange })
      expect(h.getTextbox()).toHaveValue("first")

      await h.rerender({ ariaLabel, value: "second", onValueChange })

      expect(h.getTextbox()).toHaveValue("second")
      expect(changes).toEqual([])
    })

    it("blocks typing while disabled and restores it when re-enabled", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, disabled: false, onValueChange })
      await h.type(h.getTextbox(), "a")
      expect(changes).toEqual(["a"])

      await h.rerender({ ariaLabel, disabled: true, onValueChange })
      expect(h.getTextbox()).toBeDisabled()
      await h.type(h.getTextbox(), "b")
      expect(changes).toEqual(["a"])

      await h.rerender({ ariaLabel, disabled: false, onValueChange })
      expect(h.getTextbox()).toBeEnabled()
      await h.type(h.getTextbox(), "c")
      // The uncontrolled textarea kept "a" while disabled, so the next report ends with the new key.
      expect(changes).toHaveLength(2)
      expect(changes[1]).toMatch(/c$/)
    })

    it("keeps the server-rendered text and stays interactive after hydration", async () => {
      const changes: string[] = []
      const issues = await h.hydrate({
        ariaLabel,
        value: "Seeded notes\nsecond line",
        onValueChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expect(h.getTextbox()).toHaveValue("Seeded notes\nsecond line")

      await h.type(h.getTextbox(), "x")
      expect(changes).toHaveLength(1)
    })

    it("hydrates a disabled textarea as disabled", async () => {
      const issues = await h.hydrate({ ariaLabel, value: "locked", disabled: true })

      expect(issues).toEqual([])
      expect(h.getTextbox()).toBeDisabled()
      expect(h.getTextbox()).toHaveValue("locked")
    })
  })
}
