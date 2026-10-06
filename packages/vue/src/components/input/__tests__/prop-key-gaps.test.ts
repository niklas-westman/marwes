/**
 * Vue adapter: options the typed prop lists used to miss. Vue only receives props that are listed
 * at runtime, so each of these was silently ignored or misrouted before the lists were checked
 * against their Props types.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { TeamAvatarGroup } from "../../avatar/variants"
import { VolumeSlider } from "../../slider/variants"
import { DropdownField } from "../field-variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>): void {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}

describe("typed prop lists", () => {
  it("DropdownField applies the date variant", () => {
    renderWithProvider(DropdownField, {
      label: "Birthday",
      variant: "date",
      select: { options: [{ value: "a", label: "A" }] },
    })

    expect(document.querySelector(".mw-input-field--select-date")).not.toBeNull()
  })

  it("TeamAvatarGroup accepts label as the group name", () => {
    renderWithProvider(TeamAvatarGroup, { label: "Platform team", items: [{ initials: "MW" }] })

    expect(screen.getByRole("group", { name: /platform team/i })).toBeInTheDocument()
  })

  it("VolumeSlider applies labelPosition", () => {
    renderWithProvider(VolumeSlider, { labelPosition: "inline" })

    expect(document.querySelector(".mw-slider-field--label-inline")).not.toBeNull()
  })
})
