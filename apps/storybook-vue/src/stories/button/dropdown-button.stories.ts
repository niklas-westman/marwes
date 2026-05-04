import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DropdownButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/DropdownButton",
  component: DropdownButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DropdownButton>

export default meta
type Story = StoryObj<typeof meta>

export const DropdownExample: Story = {
  args: {},
  render: (args) => ({
    components: { DropdownButton },
    setup() {
      return { args }
    },
    template: `<DropdownButton v-bind="args">Dropdown</DropdownButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.dropdownButton,
      },
    },
  },
}
