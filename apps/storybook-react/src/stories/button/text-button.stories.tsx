import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { type Button, TextButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/General/Text",
  component: TextButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const TextExample: Story = {
  args: {
    children: "Text Button",
  },
}
