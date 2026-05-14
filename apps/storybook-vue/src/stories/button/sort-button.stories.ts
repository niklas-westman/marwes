import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SortButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/SortButton",
  component: SortButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SortButton>

export default meta
type Story = StoryObj<typeof meta>

export const SortExample: Story = {
  args: {},
  render: (args) => ({
    components: { SortButton },
    setup() {
      return { args }
    },
    template: `<SortButton v-bind="args">Sort</SortButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.sortButton,
      },
    },
  },
}
