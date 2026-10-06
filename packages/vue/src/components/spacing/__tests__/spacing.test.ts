/**
 * Vue adapter: Tests the Spacing component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { Spacings } from "@marwes-ui/core"
import { render } from "@testing-library/vue"
import { expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runSpacingContract } from "../../../../../../tests/contracts/spacing.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Spacer, Spacing } from "../spacing"

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

runSpacingContract("vue", {
  renderSpacingOptions(options) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, { default: () => h(Spacing as never, { ...options }) })
        },
      }),
    )
  },
  getSpacingRoot() {
    return document.querySelector('[data-component="spacing"]') as HTMLElement
  },
  renderSpacing(args = {}) {
    const spacingProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.scale !== undefined ? { scale: args.scale } : {}),
      ...args.attributes,
    }

    renderWithProvider(Spacing, spacingProps)
  },
  getSpacingElement() {
    return document.querySelector(".mw-spacing")
  },
})

it("supports Spacer with spacing token dot notation", () => {
  renderWithProvider(Spacer, { spacing: Spacings.sp24 })

  const spacingElement = document.querySelector(".mw-spacing")
  expect(spacingElement).toHaveAttribute("data-size", "sp-24")
  expect((spacingElement as HTMLElement).style.getPropertyValue("--mw-spacing-value")).toBe(
    "var(--mw-spacing-sp-24)",
  )
})
