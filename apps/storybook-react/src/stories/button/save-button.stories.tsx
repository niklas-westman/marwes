import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, SaveButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SaveButton",
  component: SaveButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const SaveExample: StoryObj<typeof SaveButton> = {
  args: {
    children: "Save",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.saveButton,
      },
    },
  },
}
