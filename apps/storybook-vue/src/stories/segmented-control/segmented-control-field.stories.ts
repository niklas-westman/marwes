import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SegmentedControlField } from "@marwes-ui/vue"
import type { SegmentedControlFieldProps, SegmentedControlItem } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

type Density = "compact" | "comfortable" | "spacious"

const densityItems: SegmentedControlItem<Density>[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
]

const meta = {
  title: "SegmentedControl/Molecule/SegmentedControlField",
  component: SegmentedControlField as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
    segmentedControl: { items: densityItems },
  },
} satisfies Meta<SegmentedControlFieldProps>

export default meta

type Story = StoryObj<SegmentedControlFieldProps>

export const Basic: Story = {
  render: (args) => ({
    components: { SegmentedControlField },
    setup() {
      const value = ref<Density>("comfortable")
      return { args, value }
    },
    template: `
      <div style="width: 420px;">
        <SegmentedControlField
          :label="args.label"
          :description="args.description"
          :segmentedControl="{ ...(args.segmentedControl ?? {}), modelValue: value, 'onUpdate:modelValue': (v) => value = v }"
        />
      </div>
    `,
  }),
}

export const WithoutDescription: Story = {
  args: {
    label: "Row density",
    segmentedControl: { items: densityItems },
  },
  render: (args) => ({
    components: { SegmentedControlField },
    setup() {
      const value = ref<Density>("comfortable")
      return { args, value }
    },
    template: `
      <div style="width: 420px;">
        <SegmentedControlField
          :label="args.label"
          :segmentedControl="{ ...(args.segmentedControl ?? {}), modelValue: value, 'onUpdate:modelValue': (v) => value = v }"
        />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: {
    label: "Row density",
    error: "Choose a density before saving.",
    segmentedControl: { items: densityItems },
  },
  render: (args) => ({
    components: { SegmentedControlField },
    setup() {
      const value = ref<Density>("comfortable")
      return { args, value }
    },
    template: `
      <div style="width: 420px;">
        <SegmentedControlField
          :label="args.label"
          :error="args.error"
          :segmentedControl="{ ...(args.segmentedControl ?? {}), modelValue: value, 'onUpdate:modelValue': (v) => value = v }"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
    segmentedControl: { items: densityItems, disabled: true },
  },
  render: (args) => ({
    components: { SegmentedControlField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 420px;">
        <SegmentedControlField v-bind="args" />
      </div>
    `,
  }),
}

export const FullWidth: Story = {
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
    segmentedControl: { items: densityItems, fullWidth: true },
  },
  render: (args) => ({
    components: { SegmentedControlField },
    setup() {
      const value = ref<Density>("comfortable")
      return { args, value }
    },
    template: `
      <div style="width: 420px;">
        <SegmentedControlField
          :label="args.label"
          :description="args.description"
          :segmentedControl="{ ...(args.segmentedControl ?? {}), modelValue: value, 'onUpdate:modelValue': (v) => value = v }"
        />
      </div>
    `,
  }),
}
