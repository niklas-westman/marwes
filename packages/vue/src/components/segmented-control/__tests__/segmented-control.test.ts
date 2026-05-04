import { SegmentedControlVariant } from "@marwes-ui/core"
import userEvent from "@testing-library/user-event"
import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { runSegmentedControlContract } from "../../../../../../tests/contracts/segmented-control.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SegmentedControl, type SegmentedControlProps } from "../segmented-control"

const defaultOptions = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "cards", label: "Cards" },
]

type SegmentedControlTestProps = SegmentedControlProps & {
  "onUpdate:modelValue"?: (value: string) => void
  class?: string
}

function renderSegmentedControlWithProvider(props: SegmentedControlTestProps) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(SegmentedControl, props),
          })
      },
    }),
  )
}

runSegmentedControlContract("vue", {
  async renderSegmentedControl(args = {}) {
    const { onValueChange, ...restArgs } = args

    renderSegmentedControlWithProvider({
      ariaLabel: "View mode",
      options: args.options ?? defaultOptions,
      ...restArgs,
      ...(onValueChange ? { "onUpdate:modelValue": onValueChange } : {}),
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  keyDown(element, key) {
    fireEvent.keyDown(element, { key })
  },
})

describe("Vue adapter specifics: SegmentedControl", () => {
  it("renders option icons inside the item shell", () => {
    renderSegmentedControlWithProvider({
      ariaLabel: "Theme",
      options: [
        { value: "light", label: "Light", icon: h("span", { "data-testid": "light-icon" }, "☀") },
        { value: "dark", label: "Dark", icon: h("span", { "data-testid": "dark-icon" }, "☾") },
      ],
    })

    expect(
      screen.getByTestId("light-icon").closest(".mw-segmented-control__item-icon"),
    ).not.toBeNull()
  })

  it("applies the contrast variant class", () => {
    renderSegmentedControlWithProvider({
      ariaLabel: "Theme mode",
      variant: SegmentedControlVariant.contrast,
      options: defaultOptions,
    })

    const group = screen.getByRole("radiogroup", { name: /theme mode/i })
    expect(group).toHaveClass("mw-segmented-control--contrast")
    expect(group).toHaveAttribute("data-variant", "contrast")
  })

  it("merges class attr with the recipe output", () => {
    renderSegmentedControlWithProvider({
      ariaLabel: "View mode",
      class: "custom-class",
      options: defaultOptions,
    })

    expect(screen.getByRole("radiogroup", { name: /view mode/i })).toHaveClass(
      "mw-segmented-control",
      "custom-class",
    )
  })

  it("emits update:modelValue with the next value", async () => {
    const updateHandler = vi.fn()

    renderSegmentedControlWithProvider({
      ariaLabel: "View mode",
      modelValue: "list",
      options: defaultOptions,
      "onUpdate:modelValue": updateHandler,
    })

    await userEvent.setup().click(screen.getByRole("radio", { name: /grid/i }))

    expect(updateHandler).toHaveBeenCalledWith("grid")
  })
})
