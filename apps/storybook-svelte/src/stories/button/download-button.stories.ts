import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { DownloadButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Purpose/DownloadButton",
  component: DownloadButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DownloadButton>

export default meta
type Story = StoryObj<typeof meta>

export const DownloadExample: Story = {
  args: { children: "Download" },
}
