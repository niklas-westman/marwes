import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { UploadButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/UploadButton",
  component: UploadButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof UploadButton>

export default meta
type Story = StoryObj<typeof meta>

export const UploadExample: Story = {
  args: {},
  render: (args) => ({
    components: { UploadButton },
    setup() {
      return { args }
    },
    template: `<UploadButton v-bind="args">Upload</UploadButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.uploadButton,
      },
    },
  },
}
