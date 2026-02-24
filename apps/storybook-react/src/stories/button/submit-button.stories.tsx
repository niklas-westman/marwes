import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, SubmitButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/SubmitButton",
  component: SubmitButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const SubmitExample: StoryObj<typeof SubmitButton> = {
  render: () => <SubmitButton>Submit Form</SubmitButton>,
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.submitButton,
      },
    },
  },
}
