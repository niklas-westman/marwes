import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, SortButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SortButton",
  component: SortButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const SortExample: StoryObj<typeof SortButton> = {
  args: {
    children: "Sort",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.sortButton,
      },
    },
  },
}
