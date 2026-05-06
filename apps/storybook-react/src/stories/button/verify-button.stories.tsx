import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { VerifyButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/VerifyButton",
  component: VerifyButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof VerifyButton>

export default meta

export const VerifyExample: StoryObj<typeof VerifyButton> = {
  args: {
    children: "Verify",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.verifyButton,
      },
    },
  },
}
