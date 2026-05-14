/**
 * Vue adapter: Tests the Icon component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { Icon } from ".."
import { runIconContract } from "../../../../../../tests/contracts/icon.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(component: unknown, props: Record<string, unknown> = {}) {
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

runIconContract("vue", {
  async renderIcon(args = {}) {
    const iconProps = {
      name: "search",
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.strokeWidth !== undefined ? { strokeWidth: args.strokeWidth } : {}),
    }

    renderWithProvider(Icon, iconProps)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as unknown as SVGElement
  },
  queryByRole(role) {
    return screen.queryByRole(role) as unknown as SVGElement | null
  },
  querySvg() {
    return document.querySelector("svg")
  },
})

describe("Icon (Vue)", () => {
  it("warns in development when decorative=false is passed without ariaLabel", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    renderWithProvider(Icon, { name: "search", decorative: false })

    expect(warnSpy).toHaveBeenCalledWith(
      "[marwes] Icon: decorative={false} was passed without ariaLabel. " +
        "The icon stays hidden from assistive technology unless ariaLabel is also provided.",
    )

    warnSpy.mockRestore()
  })
})
