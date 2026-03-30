import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { RefreshButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/RefreshButton",
  component: RefreshButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof RefreshButton>

export default meta
type Story = StoryObj<typeof meta>

export const RefreshExample: Story = {
  render: () => ({
    components: { RefreshButton },
    template: "<RefreshButton>Refresh</RefreshButton>",
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.refreshButton,
      },
    },
  },
}
