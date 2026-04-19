import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tab } from "../tab"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown> = {},
  children?: string,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: children ? () => children : undefined,
              }),
          })
      },
    }),
  )
}

describe("Vue Tab", () => {
  it("uses ariaLabel for icon-only tabs", () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h("div", { role: "tablist", "aria-label": "Example tabs" }, [
                  h(
                    Tab,
                    {
                      ariaLabel: "Settings",
                      ariaControls: "panel-settings",
                    },
                    {
                      default: () => h("span", { "aria-hidden": "true" }, "⚙️"),
                    },
                  ),
                ]),
            })
        },
      }),
    )

    const tab = screen.getByRole("tab", { name: /settings/i })

    expect(tab).toHaveAttribute("aria-label", "Settings")
    expect(tab).toHaveAttribute("aria-controls", "panel-settings")
  })

  it("renders disabled tabs as disabled controls with aria-disabled and tabIndex -1", () => {
    renderWithProvider(Tab, { disabled: true, ariaControls: "panel-settings" }, "Settings")

    const tab = screen.getByRole("tab", { name: /settings/i })

    expect(tab).toBeDisabled()
    expect(tab).toHaveAttribute("aria-disabled", "true")
    expect(tab).toHaveAttribute("tabindex", "-1")
  })
})
