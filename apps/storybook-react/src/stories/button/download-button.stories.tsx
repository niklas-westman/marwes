import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { type Button, DownloadButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/DownloadButton",
  component: DownloadButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof Button>

export default meta

export const DownloadExample: StoryObj<typeof DownloadButton> = {
  args: {
    children: "Download",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.downloadButton,
      },
    },
  },
}
