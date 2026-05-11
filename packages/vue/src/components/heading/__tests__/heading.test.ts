/**
 * Vue adapter: Tests the Heading component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { H1, H2, H3 } from ".."
import { runHeadingContract } from "../../../../../../tests/contracts/heading.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown> = {},
  text?: string,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: text ? () => text : undefined,
              }),
          })
      },
    }),
  )
}

runHeadingContract("vue", {
  async renderHeading(args) {
    const headingProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
    }

    if (args.level === 1) {
      renderWithProvider(H1, headingProps, args.text)
      return
    }

    if (args.level === 2) {
      renderWithProvider(H2, headingProps, args.text)
      return
    }

    renderWithProvider(H3, headingProps, args.text)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})
