import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { SubmitButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/SubmitButton",
  component: SubmitButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SubmitButton>

export default meta
type Story = StoryObj<typeof meta>

export const SubmitExample: Story = {
  args: {},
  render: (args) => ({
    components: { SubmitButton },
    setup() {
      return { args }
    },
    template: `<SubmitButton v-bind="args">Submit Form</SubmitButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.submitButton,
      },
    },
  },
}
