import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { CloseButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/CloseButton",
  component: CloseButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CloseButton>

export default meta
type Story = StoryObj<typeof meta>

export const CloseExample: Story = {
  args: {},
  render: (args) => ({
    components: { CloseButton },
    setup() {
      return { args }
    },
    template: `<CloseButton v-bind="args">Close</CloseButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.closeButton,
      },
    },
  },
}
