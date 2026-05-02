import { storybookLayout } from "@marwes-ui/core"
import type { RatingRadioGroupProps } from "@marwes-ui/vue"
import { RatingRadioGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Radio/Purpose/Rating",
  component: RatingRadioGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<RatingRadioGroupProps>

export default meta
type Story = StoryObj<RatingRadioGroupProps>

export const Default: Story = {
  args: {
    name: "satisfaction",
    label: "How satisfied are you?",
  },
}

export const CustomRange: Story = {
  args: {
    name: "priority",
    label: "Priority level",
    min: 1,
    max: 3,
  },
}

export const CustomLabels: Story = {
  args: {
    name: "priority",
    label: "Priority level",
    min: 1,
    max: 3,
    labelFn: (value: number) => {
      const labels: Record<number, string> = {
        1: "Low",
        2: "Medium",
        3: "High",
      }

      return labels[value] ?? String(value)
    },
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { RatingRadioGroup },
    setup() {
      const value = ref("3")
      return { value }
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <RatingRadioGroup
          name="satisfaction"
          label="Satisfaction"
          v-model="value"
        />
        <p style="font-size: 14px; color: #6b7280;">Selected: {{ value }}</p>
      </div>
    `,
  }),
}
