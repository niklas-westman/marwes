import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DestructiveButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/DestructiveButton",
  component: DestructiveButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DestructiveButton>

export default meta

export const DestructiveExample: StoryObj<typeof DestructiveButton> = {
  args: {
    children: "Delete",
    iconRight: "trash",
    error: true,
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.destructiveButton,
      },
    },
  },
}
