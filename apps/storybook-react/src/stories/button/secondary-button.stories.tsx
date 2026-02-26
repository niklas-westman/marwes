import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { type Button, SecondaryButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/General/Secondary",
  component: SecondaryButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const SecondaryExample: Story = {
  args: {
    children: "Secondary Button",
  },
}
