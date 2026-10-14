import { describe, expect, it } from "vitest"

export interface PresentationUpdatesProps {
  visible: boolean
  onAction?: () => void
}
export interface PresentationUpdatesHarness {
  hydrate(props: PresentationUpdatesProps): Promise<string[]>
  rerender(props: PresentationUpdatesProps): void | Promise<void>
  getRoot(): HTMLElement | null
  getAction(): HTMLElement
  click(element: HTMLElement): Promise<void>
}
export function runPresentationUpdatesContract(
  adapter: string,
  name: string,
  h: PresentationUpdatesHarness,
): void {
  describe(`${name} hydrated presentation: ${adapter}`, () => {
    it("mounts and removes presentation content after hydration and delivers one callback", async () => {
      let actions = 0
      const props = {
        visible: false,
        onAction: () => {
          actions += 1
        },
      }
      expect(await h.hydrate(props)).toEqual([])
      expect(h.getRoot()).toBeNull()
      await h.rerender({ ...props, visible: true })
      expect(h.getRoot()).toHaveAccessibleName("Actions")
      for (const element of document.querySelectorAll("[aria-labelledby], [aria-describedby]")) {
        for (const key of ["aria-labelledby", "aria-describedby"])
          for (const id of (element.getAttribute(key) ?? "").split(/\s+/).filter(Boolean))
            expect(document.getElementById(id)).not.toBeNull()
      }
      await h.click(h.getAction())
      expect(actions).toBe(1)
      await h.rerender(props)
      expect(h.getRoot()).toBeNull()
    })
    it("keeps visible server presentation through hydration", async () => {
      expect(await h.hydrate({ visible: true })).toEqual([])
      expect(h.getRoot()).toHaveAccessibleName("Actions")
    })
  })
}
