import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { PrimaryButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/General/Primary",
  component: PrimaryButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
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
