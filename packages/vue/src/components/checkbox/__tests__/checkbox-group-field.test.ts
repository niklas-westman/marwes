/**
 * Vue adapter: Tests the Checkbox Group Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runCheckboxGroupFieldContract } from "../../../../../../tests/contracts/checkbox-group-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { CheckboxGroupField, type CheckboxGroupFieldProps } from "../checkbox-group-field"

type CheckboxGroupFieldRenderProps = CheckboxGroupFieldProps & {
  onChange?: (value: string[]) => void
}

function renderWithProvider(props: CheckboxGroupFieldRenderProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(CheckboxGroupField, props) })
      },
    }),
  )
}

runCheckboxGroupFieldContract("Vue", {
  renderCheckboxGroup: (args = {}) => {
    const fieldProps: CheckboxGroupFieldRenderProps = {
      label: args.label ?? "Communication preferences",
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.value !== undefined ? { value: args.value } : {}),
      ...(args.onChange !== undefined ? { onChange: args.onChange } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      options: args.options ?? [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push" },
      ],
    }

    renderWithProvider(fieldProps)
  },
  getByRole: (role, options) => screen.getByRole(role, options),
  getAllByRole: (role) => screen.getAllByRole(role) as HTMLInputElement[],
  getByText: (text) => screen.getByText(text),
  click: async (element) => {
    const user = userEvent.setup()
    await user.click(element)
  },
})

describe("Vue adapter specifics: CheckboxGroupField", () => {
  it("renders helper text before the option list and uses checkbox-sized option labels", () => {
    renderWithProvider({
      label: "Notification channels",
      description: "Choose how we can reach you.",
      options: [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
      ],
    })

    const description = screen
      .getByText("Choose how we can reach you.")
      .closest(".mw-checkbox-group-field__description") as HTMLElement | null
    const options = document.querySelector(
      ".mw-checkbox-group-field__options",
    ) as HTMLElement | null
    const optionLabel = screen.getByText("Email")

    expect(description).not.toBeNull()
    expect(options).not.toBeNull()
    expect(
      description && options
        ? description.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING
        : 0,
    ).toBeTruthy()
    expect(optionLabel).toHaveClass("mw-text", "mw-text--label")
  })

  it("disables only the flagged option when option.disabled is set", () => {
    renderWithProvider({
      label: "Notification channels",
      options: [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS", disabled: true },
      ],
    })

    expect(screen.getByRole("checkbox", { name: /email/i })).not.toBeDisabled()
    expect(screen.getByRole("checkbox", { name: /sms/i })).toBeDisabled()
  })
})
