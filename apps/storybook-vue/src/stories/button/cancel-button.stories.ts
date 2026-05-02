import { storybookButtonPurposeArgTypes, storybookLayout } from "@marwes-ui/core"
import { CancelButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/CancelButton",
  component: CancelButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CancelButton>

export default meta
type Story = StoryObj<typeof meta>

export const CancelExample: Story = {
  args: {
    iconRight: "x",
  },
  render: (args) => ({
    components: { CancelButton },
    setup() {
      return { args }
    },
    template: `<CancelButton v-bind="args">Cancel</CancelButton>`,
  }),
}
