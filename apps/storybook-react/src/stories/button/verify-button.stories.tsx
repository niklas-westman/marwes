import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, VerifyButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/VerifyButton",
  component: VerifyButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

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
