/**
 * Vue adapter: Tests the Checkbox Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runCheckboxFieldContract } from "../../../../../../tests/contracts/checkbox-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { CheckboxField, type CheckboxFieldProps } from "../checkbox-field"

function renderWithProvider(props: CheckboxFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(CheckboxField, props) })
      },
    }),
  )
}

runCheckboxFieldContract("vue", {
  async renderCheckboxField(args) {
    renderWithProvider({
      label: args.label,
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      checkbox: {
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.checked !== undefined ? { checked: args.checked } : {}),
        ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-checkbox-field__description") as HTMLElement | null
  },
  queryErrorRegion() {
    return document.querySelector(
      '.mw-checkbox-field__error[aria-live="polite"]',
    ) as HTMLElement | null
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
