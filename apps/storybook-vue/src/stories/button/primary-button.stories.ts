import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { PrimaryButton, SecondaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { expect, userEvent, within } from "storybook/test"
import { ref } from "vue"

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
  args: {},
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args }
    },
    template: `<PrimaryButton v-bind="args">Primary Button</PrimaryButton>`,
  }),
}

export const LoadingFullConfig: Story = {
  args: {
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: false,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
  },
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args }
    },
    template: `<PrimaryButton v-bind="args">Save</PrimaryButton>`,
  }),
}

export const LoadingFullConfigBlocking: Story = {
  args: {
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
  },
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args }
    },
    template: `<PrimaryButton v-bind="args">Save</PrimaryButton>`,
  }),
}

export const FormSubmit: Story = {
  args: { type: "submit" },
  render: (args) => ({
    components: { PrimaryButton, SecondaryButton },
    setup() {
      const submitted = ref(false)
      return { args, submitted }
    },
    template: `<form @submit.prevent="submitted = true">
      <label>Name <input name="name" value="Marwes" /></label>
      <PrimaryButton v-bind="args">Submit form</PrimaryButton>
      <SecondaryButton type="reset">Reset form</SecondaryButton>
      <output>{{ submitted ? 'Form submitted' : 'Ready to submit' }}</output>
    </form>`,
  }),
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
