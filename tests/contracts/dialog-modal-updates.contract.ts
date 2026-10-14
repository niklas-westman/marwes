import { describe, expect, it } from "vitest"

export interface DialogModalUpdatesProps {
  open: boolean
  title: string
  portalMode?: "inline" | "default" | "custom"
  onOpenChange?: (open: boolean) => void
}
export interface DialogModalUpdatesHarness {
  hydrate(props: DialogModalUpdatesProps): Promise<string[]>
  rerender(props: DialogModalUpdatesProps): void | Promise<void>
  getDialog(): HTMLElement | null
  getTrigger(): HTMLElement
  getScrim(): HTMLElement
  click(element: HTMLElement): Promise<void>
  keyboard(keys: string): Promise<void>
  waitFor(assertion: () => void): Promise<void>
  portalModes: Array<"inline" | "default" | "custom">
}
export function runDialogModalUpdatesContract(
  adapter: string,
  name: string,
  h: DialogModalUpdatesHarness,
): void {
  describe(`${name} hydrated lifecycle: ${adapter}`, () => {
    for (const portalMode of h.portalModes) {
      it(`opens and closes after hydration (${portalMode}) with focus and scroll restored`, async () => {
        const changes: boolean[] = []
        const props = {
          open: false,
          title: "Archive project",
          portalMode,
          onOpenChange: (open: boolean) => changes.push(open),
        }
        const overflow = document.body.style.overflow
        expect(await h.hydrate(props)).toEqual([])
        expect(h.getDialog()).toBeNull()
        const trigger = h.getTrigger()
        await h.click(trigger)
        await h.rerender({ ...props, open: true })
        const dialog = h.getDialog()
        expect(dialog).toHaveAccessibleName(props.title)
        expect(dialog).toHaveAttribute("aria-modal", "true")
        if (portalMode === "custom")
          expect(document.getElementById("modal-portal-target")).toContainElement(dialog)
        await h.waitFor(() => {
          expect(dialog).toContainElement(document.activeElement as HTMLElement)
          expect(document.body.style.overflow).toBe("hidden")
        })
        const first = document.activeElement
        await h.keyboard("{Tab}{Tab}")
        if (name === "DialogModal") expect(document.activeElement).toBe(first)
        await h.keyboard("{Escape}")
        expect(changes).toEqual([false])
        await h.rerender(props)
        await h.waitFor(() => expect(document.activeElement).toBe(trigger))
        expect(document.body.style.overflow).toBe(overflow)
        expect(h.getDialog()).toBeNull()
        await h.rerender({ ...props, open: true })
        await h.click(h.getScrim())
        expect(changes).toEqual([false, false])
        await h.rerender(props)
        expect(document.body.style.overflow).toBe(overflow)
      })
    }
  })
}
