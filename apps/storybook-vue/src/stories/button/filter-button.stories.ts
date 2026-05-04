import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { FilterButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/FilterButton",
  component: FilterButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof FilterButton>

export default meta
type Story = StoryObj<typeof meta>

export const FilterExample: Story = {
  args: {},
  render: (args) => ({
    components: { FilterButton },
    setup() {
      return { args }
    },
    template: `<FilterButton v-bind="args">Filter</FilterButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.filterButton,
      },
    },
  },
}
