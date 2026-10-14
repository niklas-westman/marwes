import { describe, expect, it } from "vitest"

export interface TooltipUpdatesProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
}
export interface TooltipUpdatesHarness {
  hydrate(props: TooltipUpdatesProps): Promise<string[]>
  rerender(props: TooltipUpdatesProps): void | Promise<void>
  getTrigger(): HTMLElement
  getTooltip(): HTMLElement | null
  focus(element: HTMLElement): Promise<void>
  keyboard(keys: string): Promise<void>
  waitFor(assertion: () => void): Promise<void>
}
export function runTooltipUpdatesContract(adapter: string, h: TooltipUpdatesHarness): void {
  describe(`Tooltip hydrated updates: ${adapter}`, () => {
    it("updates the tooltip reference and reports Escape exactly once", async () => {
      const changes: boolean[] = []
      const props = { open: false, onOpenChange: (open: boolean) => changes.push(open) }
      expect(await h.hydrate(props)).toEqual([])
      expect(h.getTooltip()).toBeNull()
      await h.rerender({ ...props, open: true })
      const tooltip = h.getTooltip()
      expect(tooltip).toHaveTextContent("Helpful text")
      expect(document.getElementById(h.getTrigger().getAttribute("aria-describedby") ?? "")).toBe(
        tooltip,
      )
      expect(changes).toEqual([])
      await h.focus(h.getTrigger())
      await h.keyboard("{Escape}")
      expect(changes).toEqual([false])
      await h.rerender(props)
      expect(h.getTrigger()).not.toHaveAttribute("aria-describedby")
      await h.waitFor(() => expect(h.getTooltip()).toBeNull())
    })
    it("keeps an initially visible tooltip and its id through hydration", async () => {
      expect(await h.hydrate({ open: true })).toEqual([])
      expect(document.getElementById(h.getTrigger().getAttribute("aria-describedby") ?? "")).toBe(
        h.getTooltip(),
      )
    })
  })
}
