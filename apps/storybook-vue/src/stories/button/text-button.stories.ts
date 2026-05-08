import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { TextButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Variant/TextButton",
  component: TextButton,
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
} satisfies Meta<typeof TextButton>

export default meta
type Story = StoryObj<typeof meta>

export const TextExample: Story = {
  args: {},
  render: (args) => ({
    components: { TextButton },
    setup() {
      return { args }
    },
    template: `<TextButton v-bind="args">Text Button</TextButton>`,
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
    components: { TextButton },
    setup() {
      return { args }
    },
    template: `<TextButton v-bind="args">Save</TextButton>`,
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
    components: { TextButton },
    setup() {
      return { args }
    },
    template: `<TextButton v-bind="args">Save</TextButton>`,
  }),
}
