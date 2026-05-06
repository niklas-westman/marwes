import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { CloseButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/CloseButton",
  component: CloseButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CloseButton>

export default meta

export const CloseExample: StoryObj<typeof CloseButton> = {
  args: {
    children: "Close",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.closeButton,
      },
    },
  },
}
