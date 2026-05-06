import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { EditButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/EditButton",
  component: EditButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof EditButton>

export default meta

export const EditExample: StoryObj<typeof EditButton> = {
  args: {
    children: "Edit",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.editButton,
      },
    },
  },
}
