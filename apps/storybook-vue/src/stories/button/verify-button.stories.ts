import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { VerifyButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/VerifyButton",
  component: VerifyButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof VerifyButton>

export default meta
type Story = StoryObj<typeof meta>

export const VerifyExample: Story = {
  args: {},
  render: (args) => ({
    components: { VerifyButton },
    setup() {
      return { args }
    },
    template: `<VerifyButton v-bind="args">Verify</VerifyButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.verifyButton,
      },
    },
  },
}
