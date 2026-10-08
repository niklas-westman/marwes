/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The component
 * also emits the matching event, which Vue resolves to the same prop handler.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { TooltipGroup } from "../tooltip-group"

describe("Vue TooltipGroup change callbacks", () => {
  it("calls onOpenChange once when the tooltip opens", async () => {
    const onOpenChange = vi.fn()
    renderInProvider(TooltipGroup, {
      content: "Helpful billing context",
      triggerLabel: "Billing help",
      onOpenChange,
    })

    await userEvent.setup().hover(screen.getByRole("button", { name: /billing help/i }))

    expect(onOpenChange.mock.calls).toEqual([[true]])
  })
})
