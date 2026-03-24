import { storybookLayout } from "@marwes-ui/core"
import type { YesNoRadioGroupProps } from "@marwes-ui/vue"
import { YesNoRadioGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Radio/Context/YesNo",
  component: YesNoRadioGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<YesNoRadioGroupProps>

export default meta
type Story = StoryObj<YesNoRadioGroupProps>

export const Default: Story = {
  args: {
    name: "accept",
    label: "Do you accept the terms?",
  },
}

export const CustomLabels: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to newsletter?",
    yesLabel: "Subscribe",
    noLabel: "No thanks",
  },
}

export const WithError: Story = {
  args: {
    name: "accept",
    label: "Do you accept the terms?",
    error: "You must make a selection.",
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { YesNoRadioGroup },
    setup() {
      const value = ref("")
      return { value }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <YesNoRadioGroup
          name="accept"
          label="Accept terms?"
          v-model="value"
        />
        <p style="font-size: 14px; color: #6b7280;">Selected: {{ value || "none" }}</p>
      </div>
    `,
  }),
}
