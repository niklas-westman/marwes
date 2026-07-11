import { storybookA11yPolicy, storybookIconButtonArgTypes, storybookLayout } from "@marwes-ui/core"
import { IconButton, type IconButtonProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Button/Molecule/IconButton",
  component: IconButton as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookIconButtonArgTypes,
    ariaLabel: { control: "text" },
  },
} satisfies Meta<IconButtonProps>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    icon: "x",
    ariaLabel: "Close",
    variant: "neutral",
  },
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args }
    },
    template: `<IconButton v-bind="args" />`,
  }),
}

export const Danger: Story = {
  args: {
    icon: "trash",
    ariaLabel: "Delete",
    variant: "danger",
    action: "delete",
  },
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args }
    },
    template: `<IconButton v-bind="args" />`,
  }),
}
