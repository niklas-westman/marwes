import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { CopyButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/CopyButton",
  component: CopyButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CopyButton>

export default meta

export const CopyExample: StoryObj<typeof CopyButton> = {
  args: {
    children: "Copy",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.copyButton,
      },
    },
  },
}
