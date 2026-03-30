import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, SearchButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SearchButton",
  component: SearchButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const SearchExample: StoryObj<typeof SearchButton> = {
  args: {
    children: "Search",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.searchButton,
      },
    },
  },
}
