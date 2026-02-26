import { storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import type { CheckboxFieldProps } from "@marwes-ui/vue"
import { CheckboxField, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed, ref } from "vue"

const meta: Meta<CheckboxFieldProps> = {
  title: "Checkbox/Field",
  component: CheckboxField as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  args: {
    label: "Checkbox Field Label",
    checkbox: { size: "md" },
  },
  argTypes: {
    checkbox: storybookCheckboxArgTypes,
  },
}

export default meta
type Story = StoryObj<CheckboxFieldProps>

export const FieldRecommended: Story = {
  args: {
    label: "Subscribe to updates",
    checkbox: { size: "md" },
  },
}

export const FieldWithDescription: Story = {
  args: {
    label: "Subscribe to updates",
    description: "We'll only email you about important product changes.",
    checkbox: { size: "md" },
  },
}

export const FieldWithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue.",
    checkbox: { required: true },
  },
}

export const FieldDisabled: Story = {
  args: {
    label: "Disabled option",
    description: "This option is currently unavailable.",
    checkbox: { disabled: true },
  },
}

export const FieldSizes: Story = {
  render: () => ({
    components: { CheckboxField },
    template: `
      <div style="display: grid; gap: 16px;">
        <CheckboxField label="Small checkbox" :checkbox="{ size: 'sm' }" />
        <CheckboxField label="Medium checkbox (default)" :checkbox="{ size: 'md' }" />
        <CheckboxField label="Large checkbox" :checkbox="{ size: 'lg' }" />
      </div>
    `,
  }),
}

export const FieldIndeterminate: Story = {
  render: () => ({
    components: { CheckboxField },
    setup() {
      const checked = ref(false)
      const mixed = ref(true)
      const handleUpdate = (next: boolean) => {
        mixed.value = false
        checked.value = next
      }
      return { checked, mixed, handleUpdate }
    },
    template: `
      <CheckboxField
        label="Select all items"
        description="Some items are already selected."
        :modelValue="checked"
        @update:modelValue="handleUpdate"
        :checkbox="{ indeterminate: mixed }"
      />
    `,
  }),
}

export const FieldControlled: Story = {
  render: () => ({
    components: { CheckboxField, Paragraph },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div>
        <CheckboxField
          label="Enable notifications"
          description="Get notified about new features and updates."
          v-model="checked"
        />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Status: {{ checked ? "Enabled" : "Disabled" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const FieldWithValidation: Story = {
  render: () => ({
    components: { CheckboxField },
    setup() {
      const accepted = ref(false)
      const error = computed(() =>
        accepted.value ? undefined : "You must accept the terms to proceed.",
      )
      return { accepted, error }
    },
    template: `
      <CheckboxField
        label="I accept the terms and conditions"
        :error="error"
        v-model="accepted"
        :checkbox="{ required: true }"
      />
    `,
  }),
}
