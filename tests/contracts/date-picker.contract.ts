/**
 * Shared contract for the DatePicker atom — placeholder for
 * future calendar grid interaction tests.
 */
import { expect } from "vitest"

export interface DatePickerContractHarness {
  root: Element
  queryDay(date: string): Element | null
}

export function assertDatePickerContract(harness: DatePickerContractHarness): void {
  expect(harness.root.getAttribute("data-component")).toBe("date-picker")
  expect(harness.root.getAttribute("data-device")).toBe("desktop")
  expect(harness.queryDay("2026-05-08")?.getAttribute("aria-selected")).toBe("true")
  expect(harness.queryDay("2026-05-23")?.hasAttribute("disabled")).toBe(true)
}
