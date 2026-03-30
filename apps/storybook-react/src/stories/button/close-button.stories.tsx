import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, CloseButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/CloseButton",
  component: CloseButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const CloseExample: StoryObj<typeof CloseButton> = {
  args: {
    children: "Close",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.closeButton,
      },
    },
  },
}
