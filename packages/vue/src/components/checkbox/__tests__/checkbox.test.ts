import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runCheckboxContract } from "../../../../../../tests/contracts/checkbox.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Checkbox, type CheckboxProps } from "../checkbox"

function renderWithProvider(props: CheckboxProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(Checkbox, props) })
      },
    }),
  )
}

runCheckboxContract("vue", {
  async renderCheckbox(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Checkbox",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
      ...(args.indeterminate !== undefined ? { indeterminate: args.indeterminate } : {}),
      ...(args.onCheckedChange ? { "onUpdate:modelValue": args.onCheckedChange } : {}),
    }
    renderWithProvider(props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
