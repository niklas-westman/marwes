import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SortButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SortButton",
  component: SortButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SortButton>

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
