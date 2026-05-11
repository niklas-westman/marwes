/**
 * Vue adapter: Tests Switch purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { FeatureToggle, PermissionSwitch, PreferenceSwitch } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props),
          })
      },
    }),
  )
}

describe("Vue FeatureToggle", () => {
  it("adds feature-toggle data-purpose metadata", () => {
    renderWithProvider(FeatureToggle, { label: "Enable beta dashboard", switch: { checked: true } })

    const wrapper = screen
      .getByRole("switch", { name: /enable beta dashboard/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("feature-toggle")
  })
})

describe("Vue PreferenceSwitch", () => {
  it("adds preference data-purpose metadata", () => {
    renderWithProvider(PreferenceSwitch, {
      label: "Use compact layout",
      switch: { checked: false },
    })

    const wrapper = screen
      .getByRole("switch", { name: /use compact layout/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("preference")
  })
})

describe("Vue PermissionSwitch", () => {
  it("adds permission data-purpose metadata", () => {
    renderWithProvider(PermissionSwitch, { label: "Can manage billing", switch: { checked: true } })

    const wrapper = screen
      .getByRole("switch", { name: /can manage billing/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("permission")
  })
})
