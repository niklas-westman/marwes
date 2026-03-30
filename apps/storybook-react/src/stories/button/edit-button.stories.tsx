import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, EditButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/EditButton",
  component: EditButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const EditExample: StoryObj<typeof EditButton> = {
  args: {
    children: "Edit",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.editButton,
      },
    },
  },
}
