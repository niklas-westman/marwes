import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { FilterButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/FilterButton",
  component: FilterButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof FilterButton>

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
