import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { EditButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/EditButton",
  component: EditButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof EditButton>

export default meta
type Story = StoryObj<typeof meta>

export const EditExample: Story = {
  render: () => ({
    components: { EditButton },
    template: "<EditButton>Edit</EditButton>",
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.editButton,
      },
    },
  },
}
