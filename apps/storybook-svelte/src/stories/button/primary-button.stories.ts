import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { PrimaryButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import { expect, userEvent, within } from "storybook/test"
import PrimaryButtonForm from "./PrimaryButtonForm.svelte"

const { variant: _variant, ...primaryButtonArgTypes } = storybookButtonGeneralArgTypes

const meta = {
  title: "Buttons/Variant/PrimaryButton",
  component: PrimaryButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
    docs: { description: { component: storybookDocsDescription.primaryButton } },
  },
  tags: ["autodocs"],
  argTypes: {
    ...primaryButtonArgTypes,
    children: {
      control: "text",
    },
    loading: {
      control: "object",
      description:
        "Boolean shorthand or loading config object with isLoading, disableWhileLoading, spinnerVariant, and loadingLabel.",
    },
  },
} satisfies Meta<typeof PrimaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const PrimaryExample: Story = {
  args: { children: "Primary Button" },
}

export const LoadingFullConfig: Story = {
  args: {
    children: "Save",
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: false,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
  },
}

export const LoadingFullConfigBlocking: Story = {
  args: {
    children: "Save",
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
  },
}

export const FormSubmit: Story = {
  args: { type: "submit" },
  render: (args) => ({ Component: PrimaryButtonForm, props: args }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByRole("textbox", { name: "Name" })
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, "Changed")
    await userEvent.click(canvas.getByRole("button", { name: "Reset form" }))
    await expect(nameInput).toHaveValue("Marwes")
    await expect(canvas.getByRole("status")).toHaveTextContent("Ready to submit")
    await userEvent.click(canvas.getByRole("button", { name: "Submit form" }))
    await expect(canvas.getByRole("status")).toHaveTextContent("Form submitted")
  },
}
