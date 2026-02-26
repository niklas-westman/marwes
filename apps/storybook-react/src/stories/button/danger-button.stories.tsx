import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, DangerButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/DangerButton",
  component: DangerButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const DangerExample: StoryObj<typeof DangerButton> = {
  args: {
    children: "Delete",
    iconRight: "minusSquare",
    error: true,
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.dangerButton,
      },
    },
  },
}
