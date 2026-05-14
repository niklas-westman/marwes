import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { PrimaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Variant/PrimaryButton",
  component: PrimaryButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookButtonGeneralArgTypes,
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
