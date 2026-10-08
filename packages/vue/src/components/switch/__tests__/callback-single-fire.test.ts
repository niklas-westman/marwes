/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The component
 * also emits the matching event, which Vue resolves to the same prop handler.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { Switch } from "../switch"

describe("Vue Switch change callbacks", () => {
  it("calls onCheckedChange once per toggle", async () => {
    const onCheckedChange = vi.fn()
    renderInProvider(Switch, { ariaLabel: "Notifications", onCheckedChange })

    await userEvent.setup().click(screen.getByRole("switch"))

    expect(onCheckedChange.mock.calls).toEqual([[true]])
  })
})
