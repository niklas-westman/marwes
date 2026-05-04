import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { CopyButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/CopyButton",
  component: CopyButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const CopyExample: Story = {
  args: {},
  render: (args) => ({
    components: { CopyButton },
    setup() {
      return { args }
    },
    template: `<CopyButton v-bind="args">Copy</CopyButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.copyButton,
      },
    },
  },
}
