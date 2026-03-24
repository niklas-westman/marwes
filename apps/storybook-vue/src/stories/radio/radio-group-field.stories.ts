import { storybookLayout } from "@marwes-ui/core"
import type { RadioGroupFieldProps } from "@marwes-ui/vue"
import { RadioGroupField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const colorOptions = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
]

const meta = {
  title: "Radio/Molecule",
  component: RadioGroupField as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<RadioGroupFieldProps>

export default meta
type Story = StoryObj<RadioGroupFieldProps>

export const Playground: Story = {
  args: {
    name: "color",
    label: "Favorite color",
    options: colorOptions,
    defaultValue: "red",
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { RadioGroupField },
    setup() {
      const value = ref("blue")
      return { value, colorOptions }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <RadioGroupField
          name="color"
          label="Favorite color"
          :options="colorOptions"
          v-model="value"
        />
        <p style="font-size: 14px; color: #6b7280;">Selected: {{ value }}</p>
      </div>
    `,
  }),
}

export const WithDescription: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    description: "Choose the plan that best fits your needs.",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
}

export const WithError: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    error: "Please select a plan to continue.",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
  },
}

export const Disabled: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
    defaultValue: "free",
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    name: "terms",
    label: "Agree to terms",
    options: [
      { value: "agree", label: "I agree" },
      { value: "disagree", label: "I disagree" },
    ],
    required: true,
  },
}
