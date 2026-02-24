import { storybookButtonPurposeArgTypes, storybookLayout } from "@marwes-ui/core"
import { CreateButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/CreateButton",
  component: CreateButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CreateButton>

export default meta
type Story = StoryObj<typeof meta>

export const CreateExample: Story = {
  args: {
    iconRight: "plus",
  },
  render: (args) => ({
    components: { CreateButton },
    setup() {
      return { args }
    },
    template: `<CreateButton v-bind="args">Create</CreateButton>`,
  }),
}
