import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Switch } from "../switch"

function renderWithProvider(props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(Switch, props),
          })
      },
    }),
  )
}

describe("Vue adapter specifics: Switch", () => {
  it("applies size modifier classes for the public size API", () => {
    renderWithProvider({ ariaLabel: "Compact switch", size: "compact" })
    renderWithProvider({ ariaLabel: "Wide switch", size: "wide" })
    renderWithProvider({ ariaLabel: "Rich switch", size: "rich" })

    expect(screen.getByRole("switch", { name: "Compact switch" })).toHaveClass("mw-switch--compact")
    expect(screen.getByRole("switch", { name: "Wide switch" })).toHaveClass("mw-switch--wide")
    expect(screen.getByRole("switch", { name: "Rich switch" })).toHaveClass("mw-switch--rich")
  })

  it("merges class attr with the recipe output", () => {
    renderWithProvider({ ariaLabel: "Custom switch", size: "wide", class: "custom-class" })

    const switchButton = screen.getByRole("switch", { name: "Custom switch" })
    expect(switchButton).toHaveClass("mw-switch", "mw-switch--wide", "custom-class")
  })

  it("renders a disabled button and does not emit checked changes", async () => {
    const onCheckedChange = vi.fn()

    renderWithProvider({
      ariaLabel: "Disabled switch",
      checked: true,
      disabled: true,
      "onUpdate:modelValue": onCheckedChange,
    })

    const switchButton = screen.getByRole("switch", { name: "Disabled switch" })
    expect(switchButton).toBeDisabled()

    await userEvent.setup().click(switchButton)

    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
