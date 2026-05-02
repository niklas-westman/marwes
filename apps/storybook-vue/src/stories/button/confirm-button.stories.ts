import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { ConfirmButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/ConfirmButton",
  component: ConfirmButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof ConfirmButton>

export default meta
type Story = StoryObj<typeof meta>

export const ConfirmExample: Story = {
  args: {},
  render: (args) => ({
    components: { ConfirmButton },
    setup() {
      return { args }
    },
    template: `<ConfirmButton v-bind="args">Confirm</ConfirmButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.confirmButton,
      },
    },
  },
}
