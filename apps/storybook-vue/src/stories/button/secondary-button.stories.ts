import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { SecondaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Variant/SecondaryButton",
  component: SecondaryButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookButtonGeneralArgTypes,
    children: { control: "text" },
    loading: {
      control: "object",
      description:
        "Boolean shorthand or loading config object with isLoading, disableWhileLoading, spinnerVariant, and loadingLabel.",
    },
  },
} satisfies Meta<typeof SecondaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const SecondaryExample: Story = {
  args: {},
  render: (args) => ({
    components: { SecondaryButton },
    setup() {
      return { args }
    },
    template: `<SecondaryButton v-bind="args">Secondary Button</SecondaryButton>`,
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
    components: { SecondaryButton },
    setup() {
      return { args }
    },
    template: `<SecondaryButton v-bind="args">Save</SecondaryButton>`,
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
    components: { SecondaryButton },
    setup() {
      return { args }
    },
    template: `<SecondaryButton v-bind="args">Save</SecondaryButton>`,
  }),
}
