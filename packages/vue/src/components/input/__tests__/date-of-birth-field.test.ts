import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runDateOfBirthFieldContract } from "../../../../../../tests/contracts/date-of-birth-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { DateOfBirthFieldProps } from "../field-variants"
import { DateOfBirthField } from "../field-variants"

function renderWithProvider(props: DateOfBirthFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(DateOfBirthField, props) })
      },
    }),
  )
}

runDateOfBirthFieldContract("vue", {
  async renderDateOfBirthField(args) {
    const props = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: { ariaLabel: args.label },
    } as DateOfBirthFieldProps

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
    return document.querySelector('[data-purpose="date-of-birth"]')
  },
})
