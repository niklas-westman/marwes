import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SaveButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SaveButton",
  component: SaveButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SaveButton>

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
