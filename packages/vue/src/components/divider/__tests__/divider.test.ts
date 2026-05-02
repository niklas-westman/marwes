import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runDividerContract } from "../../../../../../tests/contracts/divider.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Divider } from "../divider"

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

runDividerContract("vue", {
  async renderDivider(args = {}) {
    const dividerProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.orientation !== undefined ? { orientation: args.orientation } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(Divider, dividerProps)
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
