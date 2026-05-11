/**
 * Vue adapter: Tests the Rich Text Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runRichTextFieldContract } from "../../../../../../tests/contracts/rich-text-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RichTextField, type RichTextFieldProps } from "../rich-text-field"

function renderWithProvider(props: RichTextFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(RichTextField, props) })
      },
    }),
  )
}

runRichTextFieldContract("vue", {
  async renderRichTextField(args) {
    const props = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      editor: {},
    }
    renderWithProvider(props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLDivElement
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
