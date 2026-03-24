import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import type { ButtonProps } from "@marwes-ui/vue"
import { Button } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Atom/Button",
  component: Button as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    ...storybookButtonGeneralArgTypes,
  },
} satisfies Meta<ButtonProps>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    variant: "primary",
    action: "button",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `<Button v-bind="args">Base Button</Button>`,
  }),
}

export const AsLink: Story = {
  args: {
    href: "https://example.com",
    action: "navigate",
    variant: "secondary",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `<Button v-bind="args">Go to docs</Button>`,
  }),
}

export const Loading: Story = {
  args: {
    loading: true,
    variant: "primary",
    action: "submit",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `<Button v-bind="args">Saving...</Button>`,
  }),
}
