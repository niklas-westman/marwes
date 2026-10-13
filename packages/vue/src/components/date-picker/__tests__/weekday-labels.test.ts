import { screen } from "@testing-library/vue"
import { expect, it } from "vitest"
import type { Component } from "vue"
import { captureConsoleIssues } from "../../../../../../tests/contracts/support/console-issues"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DatePicker } from "../date-picker"

it("renders and updates repeated weekday labels without duplicate-key warnings", async () => {
  const harness = createUpdateHydrationHarness<{ weekdayLabels: string[] }>(DatePicker as Component)
  const capture = captureConsoleIssues()
  try {
    const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"]
    harness.render({ weekdayLabels })
    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual(
      weekdayLabels,
    )
    const localizedLabels = ["M", "T", "O", "T", "F", "L", "S"]
    await harness.rerender({ weekdayLabels: localizedLabels })
    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual(
      localizedLabels,
    )
    expect(capture.issues).toEqual([])
  } finally {
    capture.stop()
  }
})
