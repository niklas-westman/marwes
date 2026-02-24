import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { SecondaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/General/Secondary",
  component: SecondaryButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
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
