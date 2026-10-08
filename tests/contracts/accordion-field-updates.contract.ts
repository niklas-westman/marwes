/**
 * Shared contract for AccordionField transitions — controlled openItems updates, disabled-state
 * changes and server-rendered open panels surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface AccordionFieldUpdatesProps {
  label: string
  items: Array<{ value: string; title: string; content: string; disabled?: boolean }>
  multiple?: boolean
  openItems?: string[]
  disabled?: boolean
  onOpenItemsChange?: (openItems: string[]) => void
}

export interface AccordionFieldUpdatesHarness {
  render(props: AccordionFieldUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted field with new props and flushes updates. */
  rerender(props: AccordionFieldUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: AccordionFieldUpdatesProps): Promise<string[]>
  getTrigger(title: string): HTMLElement
  getAllTriggers(): HTMLElement[]
  click(element: HTMLElement): Promise<void>
}

const base = { label: "Questions" }
const items = [
  { value: "billing", title: "Billing", content: "Billing answers" },
  { value: "security", title: "Security", content: "Security answers" },
  { value: "support", title: "Support", content: "Support answers" },
]

function expandedTitles(h: AccordionFieldUpdatesHarness): string[] {
  return h
    .getAllTriggers()
    .filter((trigger) => trigger.getAttribute("aria-expanded") === "true")
    .map((trigger) => trigger.textContent?.trim() ?? "")
}

function expectPanelsFollowTriggers(h: AccordionFieldUpdatesHarness): void {
  for (const trigger of h.getAllTriggers()) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls") ?? "")
    expect(panel).not.toBeNull()

    if (trigger.getAttribute("aria-expanded") === "true") {
      expect(panel).toBeVisible()
    } else {
      expect(panel).not.toBeVisible()
    }
  }
}

export function runAccordionFieldUpdatesContract(
  adapterName: string,
  h: AccordionFieldUpdatesHarness,
): void {
  describe(`AccordionField updates contract: ${adapterName}`, () => {
    it("moves the open panel on a controlled update without reporting a change", async () => {
      const changes: string[][] = []
      const onOpenItemsChange = (openItems: string[]): void => {
        changes.push(openItems)
      }

      await h.render({ ...base, items, openItems: ["billing"], onOpenItemsChange })
      expect(expandedTitles(h)).toEqual(["Billing"])
      expectPanelsFollowTriggers(h)

      await h.rerender({ ...base, items, openItems: ["support"], onOpenItemsChange })

      expect(expandedTitles(h)).toEqual(["Support"])
      expectPanelsFollowTriggers(h)
      expect(changes).toEqual([])
    })

    it("blocks toggling while disabled and restores it when re-enabled", async () => {
      const changes: string[][] = []
      const onOpenItemsChange = (openItems: string[]): void => {
        changes.push(openItems)
      }

      await h.render({ ...base, items, openItems: [], disabled: true, onOpenItemsChange })
      await h.click(h.getTrigger("Billing"))
      expect(changes).toEqual([])

      await h.rerender({ ...base, items, openItems: [], disabled: false, onOpenItemsChange })
      await h.click(h.getTrigger("Billing"))
      expect(changes).toEqual([["billing"]])
    })

    it("keeps the server-rendered open panel and stays interactive after hydration", async () => {
      const changes: string[][] = []
      const issues = await h.hydrate({
        ...base,
        items,
        openItems: ["security"],
        onOpenItemsChange: (openItems) => changes.push(openItems),
      })

      expect(issues).toEqual([])
      expect(expandedTitles(h)).toEqual(["Security"])
      expectPanelsFollowTriggers(h)

      await h.click(h.getTrigger("Billing"))
      expect(changes).toHaveLength(1)
    })
  })
}
