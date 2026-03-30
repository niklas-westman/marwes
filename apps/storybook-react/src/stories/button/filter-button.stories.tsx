import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, FilterButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/FilterButton",
  component: FilterButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const FilterExample: StoryObj<typeof FilterButton> = {
  args: {
    children: "Filter",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.filterButton,
      },
    },
  },
}
