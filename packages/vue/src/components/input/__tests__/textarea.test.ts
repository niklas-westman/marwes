/**
 * Vue adapter: Tests the Textarea component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import { runTextareaContract } from "../../../../../../tests/contracts/textarea.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Textarea } from "../textarea"

function renderWithProvider(component: Component, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component, props) })
      },
    }),
  )
}

runTextareaContract("vue", {
  async renderTextarea(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Textarea",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.onValueChange ? { "onUpdate:modelValue": args.onValueChange } : {}),
    }

    renderWithProvider(Textarea, props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLTextAreaElement
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
