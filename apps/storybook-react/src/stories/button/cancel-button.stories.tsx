import { storybookButtonPurposeArgTypes, storybookLayout } from "@marwes-ui/core"
import { type Button, CancelButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/CancelButton",
  component: CancelButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const CancelExample: Story = {
  args: {
    children: "Cancel",
    iconRight: "x",
  },
}
