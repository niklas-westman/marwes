import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SaveButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/SaveButton",
  component: SaveButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SaveButton>

export default meta
type Story = StoryObj<typeof meta>

export const SaveExample: Story = {
  args: {},
  render: (args) => ({
    components: { SaveButton },
    setup() {
      return { args }
    },
    template: `<SaveButton v-bind="args">Save</SaveButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.saveButton,
      },
    },
  },
}
