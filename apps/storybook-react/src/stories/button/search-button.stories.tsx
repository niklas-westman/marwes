import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SearchButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SearchButton",
  component: SearchButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SearchButton>

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
