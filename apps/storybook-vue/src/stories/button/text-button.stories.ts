import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { TextButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/General/Text",
  component: TextButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
} satisfies Meta<typeof TextButton>

export default meta
type Story = StoryObj<typeof meta>

export const TextExample: Story = {
  args: {},
  render: (args) => ({
    components: { TextButton },
    setup() {
      return { args }
    },
    template: `<TextButton v-bind="args">Text Button</TextButton>`,
  }),
}
