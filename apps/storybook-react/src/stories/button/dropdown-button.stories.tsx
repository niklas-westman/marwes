import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DropdownButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/DropdownButton",
  component: DropdownButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DropdownButton>

export default meta

export const DropdownExample: StoryObj<typeof DropdownButton> = {
  args: {
    children: "Dropdown",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.dropdownButton,
      },
    },
  },
}
