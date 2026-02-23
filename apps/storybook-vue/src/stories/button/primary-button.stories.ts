import { iconRegistry } from "@marwes-ui/core"
import { PrimaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>

const meta: Meta = {
  title: "Buttons/General/Primary",
  component: PrimaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    iconLeft: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    iconRight: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj

export const PrimaryExample: Story = {
  args: {},
  render: (args: Record<string, unknown>) => ({
    components: { PrimaryButton },
    setup() {
      return { args }
    },
    template: `<PrimaryButton v-bind="args">Primary Button</PrimaryButton>`,
  }),
}
