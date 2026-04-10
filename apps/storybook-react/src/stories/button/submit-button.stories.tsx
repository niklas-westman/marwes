import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SubmitButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SubmitButton",
  component: SubmitButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SubmitButton>

export default meta

type Story = StoryObj<typeof meta>

export const SubmitExample: Story = {
  args: {
    children: "Submit Form",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.submitButton,
      },
    },
  },
}
