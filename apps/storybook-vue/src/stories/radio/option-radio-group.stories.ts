import { storybookLayout } from "@marwes-ui/core"
import type { OptionRadioGroupProps } from "@marwes-ui/vue"
import { OptionRadioGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Radio/Context/Option",
  component: OptionRadioGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<OptionRadioGroupProps>

export default meta
type Story = StoryObj<OptionRadioGroupProps>

export const Default: Story = {
  args: {
    name: "theme",
    label: "Select theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
    defaultValue: "system",
  },
}

export const WithDescription: Story = {
  args: {
    name: "shipping",
    label: "Shipping method",
    description: "Choose how you'd like your order delivered.",
    options: [
      { value: "standard", label: "Standard (5-7 days)" },
      { value: "express", label: "Express (2-3 days)" },
      { value: "overnight", label: "Overnight" },
    ],
  },
}

export const WithError: Story = {
  args: {
    name: "shipping",
    label: "Shipping method",
    error: "Please select a shipping method.",
    options: [
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
    ],
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { OptionRadioGroup },
    setup() {
      const value = ref("dark")
      const options = [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]

      return { value, options }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <OptionRadioGroup
          name="theme"
          label="Select theme"
          :options="options"
          v-model="value"
        />
        <p style="font-size: 14px; color: #6b7280;">Selected: {{ value }}</p>
      </div>
    `,
  }),
}
