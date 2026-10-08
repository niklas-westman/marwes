/**
 * Shared contract for Slider transitions — controlled value updates, disabled-state changes and a
 * server-rendered value surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface SliderUpdatesProps {
  ariaLabel: string
  min: number
  max: number
  value?: number
  disabled?: boolean
  onValueChange?: (value: number) => void
}

export interface SliderUpdatesHarness {
  render(props: SliderUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted Slider with new props and flushes updates. */
  rerender(props: SliderUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: SliderUpdatesProps): Promise<string[]>
  getSlider(): HTMLInputElement
  /** Moves the slider the way a user would; does nothing while the slider is disabled. */
  setValue(slider: HTMLInputElement, value: number): Promise<void>
}

const base = { ariaLabel: "Radius", min: 0, max: 100 }

export function runSliderUpdatesContract(adapterName: string, h: SliderUpdatesHarness): void {
  describe(`Slider updates contract: ${adapterName}`, () => {
    it("reflects a controlled value update without reporting a change", async () => {
      const changes: number[] = []
      const onValueChange = (value: number): void => {
        changes.push(value)
      }

      await h.render({ ...base, value: 20, onValueChange })
      expect(h.getSlider()).toHaveValue("20")

      await h.rerender({ ...base, value: 60, onValueChange })

      expect(h.getSlider()).toHaveValue("60")
      expect(changes).toEqual([])
    })

    it("blocks changes while disabled and restores them when re-enabled", async () => {
      const changes: number[] = []
      const onValueChange = (value: number): void => {
        changes.push(value)
      }

      await h.render({ ...base, value: 20, disabled: true, onValueChange })
      expect(h.getSlider()).toBeDisabled()
      await h.setValue(h.getSlider(), 40)
      expect(changes).toEqual([])

      await h.rerender({ ...base, value: 20, disabled: false, onValueChange })
      expect(h.getSlider()).toBeEnabled()
      await h.setValue(h.getSlider(), 40)
      expect(changes).toEqual([40])
    })

    it("keeps the server-rendered value and stays interactive after hydration", async () => {
      const changes: number[] = []
      const issues = await h.hydrate({
        ...base,
        value: 30,
        onValueChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expect(h.getSlider()).toHaveValue("30")

      await h.setValue(h.getSlider(), 55)
      expect(changes).toEqual([55])
    })
  })
}
