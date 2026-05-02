import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runRadioGroupFieldContract } from "../../../../../../tests/contracts/radio-group-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RadioGroupField, type RadioGroupFieldProps } from "../radio-group-field"

type RadioGroupFieldTestProps = RadioGroupFieldProps & {
  "onUpdate:modelValue"?: (value: string) => void
}

function renderWithProvider(props: RadioGroupFieldTestProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(RadioGroupField, props) })
      },
    }),
  )
}

runRadioGroupFieldContract("vue", {
  async renderRadioGroup(args = {}) {
    renderWithProvider({
      name: args.name ?? "test",
      label: args.label ?? "Pick one",
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.value !== undefined ? { modelValue: args.value } : {}),
      ...(args.onValueChange !== undefined ? { "onUpdate:modelValue": args.onValueChange } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      options: args.options ?? [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
        { value: "c", label: "Gamma" },
      ],
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.required !== undefined ? { required: args.required } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role) as HTMLInputElement[]
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
