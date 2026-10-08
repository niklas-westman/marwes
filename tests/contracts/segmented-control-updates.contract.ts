/**
 * Shared contract for SegmentedControl transitions — controlled value updates, disabled-state
 * changes and a server-rendered selection surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface SegmentedControlUpdatesProps {
  ariaLabel: string
  items: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export interface SegmentedControlUpdatesHarness {
  render(props: SegmentedControlUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted control with new props and flushes updates. */
  rerender(props: SegmentedControlUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: SegmentedControlUpdatesProps): Promise<string[]>
  getItem(label: string): HTMLElement
  getAllItems(): HTMLElement[]
  isSelected(item: HTMLElement): boolean
  click(element: HTMLElement): Promise<void>
}

const ariaLabel = "View"
const items = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
]

function selectedLabels(h: SegmentedControlUpdatesHarness): string[] {
  return h
    .getAllItems()
    .filter((item) => h.isSelected(item))
    .map((item) => item.textContent?.trim() ?? "")
}

export function runSegmentedControlUpdatesContract(
  adapterName: string,
  h: SegmentedControlUpdatesHarness,
): void {
  describe(`SegmentedControl updates contract: ${adapterName}`, () => {
    it("moves the selection on a controlled update without reporting a change", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, items, value: "list", onValueChange })
      expect(selectedLabels(h)).toEqual(["List"])

      await h.rerender({ ariaLabel, items, value: "calendar", onValueChange })

      expect(selectedLabels(h)).toEqual(["Calendar"])
      expect(changes).toEqual([])
    })

    it("blocks selection while disabled and restores it when re-enabled", async () => {
      const changes: string[] = []
      const onValueChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, items, value: "list", disabled: true, onValueChange })
      await h.click(h.getItem("Board"))
      expect(changes).toEqual([])

      await h.rerender({ ariaLabel, items, value: "list", disabled: false, onValueChange })
      await h.click(h.getItem("Board"))
      expect(changes).toEqual(["board"])
    })

    it("keeps the server-rendered selection and stays interactive after hydration", async () => {
      const changes: string[] = []
      const issues = await h.hydrate({
        ariaLabel,
        items,
        value: "board",
        onValueChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expect(selectedLabels(h)).toEqual(["Board"])

      await h.click(h.getItem("List"))
      expect(changes).toEqual(["list"])
    })
  })
}
