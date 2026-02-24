import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DangerButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/DangerButton",
  component: DangerButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DangerButton>

export default meta
type Story = StoryObj<typeof meta>

export const DangerExample: Story = {
  args: {
    error: true,
  },
  render: (args) => ({
    components: { DangerButton },
    setup() {
      return { args }
    },
    template: `<DangerButton v-bind="args">Delete</DangerButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.dangerButton,
      },
    },
  },
}
