import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, ConfirmButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/ConfirmButton",
  component: ConfirmButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const ConfirmExample: StoryObj<typeof ConfirmButton> = {
  args: {
    children: "Confirm",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.confirmButton,
      },
    },
  },
}
