import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, RefreshButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/RefreshButton",
  component: RefreshButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const RefreshExample: StoryObj<typeof RefreshButton> = {
  args: {
    children: "Refresh",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.refreshButton,
      },
    },
  },
}
