/**
 * Vue adapter: Tests the Zip Code Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runZipCodeFieldContract } from "../../../../../../tests/contracts/zip-code-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { ZipCodeFieldProps } from "../field-variants"
import { ZipCodeField } from "../field-variants"

function renderWithProvider(props: ZipCodeFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(ZipCodeField, props) })
      },
    }),
  )
}

runZipCodeFieldContract("vue", {
  async renderZipCodeField(args) {
    const props = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: {},
    } as ZipCodeFieldProps

    renderWithProvider(props)
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
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
  queryPurposeRegion() {
    return document.querySelector('[data-purpose="zip-code"]')
  },
})
