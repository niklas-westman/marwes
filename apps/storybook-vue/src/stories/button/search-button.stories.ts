import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SearchButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/SearchButton",
  component: SearchButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SearchButton>

export default meta
type Story = StoryObj<typeof meta>

export const SearchExample: Story = {
  args: {},
  render: (args) => ({
    components: { SearchButton },
    setup() {
      return { args }
    },
    template: `<SearchButton v-bind="args">Search</SearchButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.searchButton,
      },
    },
  },
}
