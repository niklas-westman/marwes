import { describe, expect, it } from "vitest"

export interface DatePickerUpdatesProps {
  monthLabel: string
  selectedDate: string
  onDaySelect?: (date: string) => void
  onNextMonth?: () => void
}
export interface DatePickerUpdatesHarness {
  render(props: DatePickerUpdatesProps): void | Promise<void>
  rerender(props: DatePickerUpdatesProps): void | Promise<void>
  hydrate(props: DatePickerUpdatesProps): Promise<string[]>
  getDay(date: string): HTMLElement
  getNextMonth(): HTMLElement
  getCalendar(): HTMLElement
  click(element: HTMLElement): Promise<void>
}
export function runDatePickerUpdatesContract(adapter: string, h: DatePickerUpdatesHarness): void {
  describe(`DatePicker state updates: ${adapter}`, () => {
    const first = "2026-10-01"
    const second = "2026-10-02"
    const disabled = "2026-10-03"
    it("updates calendar props and selection without reporting a user change", async () => {
      const changes: string[] = []
      const props = {
        monthLabel: "October 2026",
        selectedDate: first,
        onDaySelect: (date: string) => changes.push(date),
      }
      await h.render(props)
      expect(h.getDay(first)).toHaveAttribute("aria-pressed", "true")
      await h.rerender({ ...props, selectedDate: second, monthLabel: "November 2026" })
      expect(h.getCalendar()).toHaveAccessibleName("November 2026")
      expect(h.getDay(second)).toHaveAttribute("aria-pressed", "true")
      expect(h.getDay(first)).not.toHaveAttribute("aria-pressed", "true")
      expect(changes).toEqual([])
    })
    it("hydrates selection and reports day/navigation events exactly once", async () => {
      const changes: string[] = []
      let navigation = 0
      expect(
        await h.hydrate({
          monthLabel: "October 2026",
          selectedDate: first,
          onDaySelect: (date) => changes.push(date),
          onNextMonth: () => {
            navigation += 1
          },
        }),
      ).toEqual([])
      expect(h.getDay(first)).toHaveAttribute("aria-pressed", "true")
      expect(h.getDay(disabled)).toBeDisabled()
      await h.click(h.getDay(disabled))
      expect(changes).toEqual([])
      await h.click(h.getDay(second))
      expect(changes).toEqual([second])
      expect(h.getDay(first)).toHaveAttribute("aria-pressed", "true")
      await h.click(h.getNextMonth())
      expect(navigation).toBe(1)
    })
  })
}
