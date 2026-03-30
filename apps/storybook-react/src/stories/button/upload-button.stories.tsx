import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, UploadButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/UploadButton",
  component: UploadButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const UploadExample: StoryObj<typeof UploadButton> = {
  args: {
    children: "Upload",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.uploadButton,
      },
    },
  },
}
