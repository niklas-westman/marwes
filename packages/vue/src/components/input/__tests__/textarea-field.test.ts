/**
 * Vue adapter: Tests the Textarea Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runTextareaFieldContract } from "../../../../../../tests/contracts/textarea-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { TextareaField, type TextareaFieldProps } from "../textarea-field"

function renderWithProvider(props: TextareaFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(TextareaField, props) })
      },
    }),
  )
}

runTextareaFieldContract("vue", {
  async renderTextareaField(args) {
    const props = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.counterText !== undefined ? { counterText: args.counterText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      textarea: {},
    }
    renderWithProvider(props)
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLTextAreaElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})
