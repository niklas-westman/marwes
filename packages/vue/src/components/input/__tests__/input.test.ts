import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import { runInputContract } from "../../../../../../tests/contracts/input.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Input } from "../input"

function renderWithProvider(component: Component, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component, props) })
      },
    }),
  )
}

runInputContract("vue", {
  async renderInput(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Input",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.onValueChange ? { "onUpdate:modelValue": args.onValueChange } : {}),
    }

    renderWithProvider(Input, props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
