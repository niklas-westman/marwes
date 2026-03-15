import { render, screen } from "@testing-library/vue"
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
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.strokeWidth !== undefined ? { strokeWidth: args.strokeWidth } : {}),
    }

    renderWithProvider(Icon, iconProps)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as SVGElement
  },
  queryByRole(role) {
    return screen.queryByRole(role) as SVGElement | null
  },
  querySvg() {
    return document.querySelector("svg")
  },
})
