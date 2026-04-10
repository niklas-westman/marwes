import { storybookButtonPurposeArgTypes, storybookLayout } from "@marwes-ui/core"
import { CreateButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/CreateButton",
  component: CreateButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CreateButton>

export default meta

export const CreateExample: StoryObj<typeof CreateButton> = {
  args: {
    children: "Create",
    iconRight: "plus",
  },
}
