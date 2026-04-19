import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { runSwitchContract } from "../../../../../../tests/contracts/switch.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Switch } from "../switch"
import { SwitchField } from "../switch-field"

function renderSwitchWithProvider(props: Record<string, unknown>) {
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

function renderSwitchFieldWithProvider(props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(SwitchField, props),
          })
      },
    }),
  )
}

runSwitchContract("vue", {
  async renderSwitch(args = {}) {
    renderSwitchWithProvider({
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.checked !== undefined ? { checked: args.checked } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onCheckedChange !== undefined
        ? { "onUpdate:modelValue": args.onCheckedChange }
        : {}),
    })
  },
  async renderSwitchField(args) {
    renderSwitchFieldWithProvider({
      label: args.label,
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      switch: {
        ...(args.checked !== undefined ? { checked: args.checked } : {}),
        ...(args.onCheckedChange !== undefined ? { onCheckedChange: args.onCheckedChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-switch-field__description")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-switch-field__error")
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

describe("Vue adapter specifics: Switch", () => {
  it("uses visible child content as the accessible name for direct switch usage", () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => h(Switch, null, { default: () => "Enable notifications" }),
            })
        },
      }),
    )

    expect(screen.getByRole("switch", { name: /enable notifications/i })).toBeInTheDocument()
  })

  it("applies size modifier classes for the public size API", () => {
    renderSwitchWithProvider({ ariaLabel: "Compact switch", size: "compact" })
    renderSwitchWithProvider({ ariaLabel: "Wide switch", size: "wide" })
    renderSwitchWithProvider({ ariaLabel: "Rich switch", size: "rich" })

    expect(screen.getByRole("switch", { name: "Compact switch" })).toHaveClass("mw-switch--compact")
    expect(screen.getByRole("switch", { name: "Wide switch" })).toHaveClass("mw-switch--wide")
    expect(screen.getByRole("switch", { name: "Rich switch" })).toHaveClass("mw-switch--rich")
  })

  it("merges class attr with the recipe output", () => {
    renderSwitchWithProvider({ ariaLabel: "Custom switch", size: "wide", class: "custom-class" })

    const switchButton = screen.getByRole("switch", { name: "Custom switch" })
    expect(switchButton).toHaveClass("mw-switch", "mw-switch--wide", "custom-class")
  })

  it("emits update:modelValue with the next checked state", async () => {
    const updateHandler = vi.fn()

    renderSwitchWithProvider({
      ariaLabel: "Email notifications",
      checked: false,
      "onUpdate:modelValue": updateHandler,
    })

    await userEvent.setup().click(screen.getByRole("switch", { name: /email notifications/i }))

    expect(updateHandler).toHaveBeenCalledWith(true)
  })
})
