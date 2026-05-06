import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { EditButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/EditButton",
  component: EditButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof EditButton>

export default meta
type Story = StoryObj<typeof meta>

export const EditExample: Story = {
  args: {},
  render: (args) => ({
    components: { EditButton },
    setup() {
      return { args }
    },
    template: `<EditButton v-bind="args">Edit</EditButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.editButton,
      },
    },
  },
}
