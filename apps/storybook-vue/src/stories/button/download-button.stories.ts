import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DownloadButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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
  args: {},
  render: (args) => ({
    components: { DownloadButton },
    setup() {
      return { args }
    },
    template: `<DownloadButton v-bind="args">Download</DownloadButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.downloadButton,
      },
    },
  },
}
