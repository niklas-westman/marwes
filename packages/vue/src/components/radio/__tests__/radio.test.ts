import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runRadioContract } from "../../../../../../tests/contracts/radio.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Radio, type RadioProps } from "../radio"

function renderWithProvider(props: RadioProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(Radio, props) })
      },
    }),
  )
}

runRadioContract("vue", {
  async renderRadio(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Radio",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
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
