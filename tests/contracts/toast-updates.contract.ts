import { describe, expect, it } from "vitest"

export interface ToastUpdatesProps {
  duration: number | null
  onDismiss?: () => void
}
export interface ToastUpdatesHarness {
  hydrate(props: ToastUpdatesProps): Promise<string[]>
  getShowButton(): HTMLElement
  getDismissButton(): HTMLElement
  getToast(): HTMLElement | null
  click(element: HTMLElement): Promise<void>
  unmount(): void | Promise<void>
  waitFor(assertion: () => void): Promise<void>
}
export function runToastUpdatesContract(adapter: string, h: ToastUpdatesHarness): void {
  describe(`Toast hydrated lifecycle: ${adapter}`, () => {
    it("creates after hydration and dismisses exactly once", async () => {
      let dismissals = 0
      expect(
        await h.hydrate({
          duration: null,
          onDismiss: () => {
            dismissals += 1
          },
        }),
      ).toEqual([])
      expect(h.getToast()).toBeNull()
      await h.click(h.getShowButton())
      expect(h.getToast()).toHaveTextContent("Saved project")
      await h.click(h.getDismissButton())
      await h.waitFor(() => expect(h.getToast()).toBeNull())
      expect(dismissals).toBe(1)
    })
    it("expires a toast and cleans timers when the provider unmounts", async () => {
      let dismissals = 0
      expect(
        await h.hydrate({
          duration: 100,
          onDismiss: () => {
            dismissals += 1
          },
        }),
      ).toEqual([])
      await h.click(h.getShowButton())
      await h.waitFor(() => {
        expect(h.getToast()).toBeNull()
        expect(dismissals).toBe(1)
      })
      await h.click(h.getShowButton())
      expect(h.getToast()).not.toBeNull()
      await h.unmount()
      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(dismissals).toBe(1)
      expect(h.getToast()).toBeNull()
    })
  })
}
