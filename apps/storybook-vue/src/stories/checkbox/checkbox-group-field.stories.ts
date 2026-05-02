import { storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import type { CheckboxGroupFieldProps } from "@marwes-ui/vue"
import { CheckboxGroupField, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed, ref } from "vue"

const notificationOptions = [
  { value: "email", label: "Email updates" },
  { value: "sms", label: "SMS alerts" },
  { value: "push", label: "Push notifications" },
]

const selectAllChildOptions = [
  { value: "drafts", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
]

const meta: Meta<CheckboxGroupFieldProps> = {
  title: "Checkbox/Molecule/CheckboxGroupField",
  component: CheckboxGroupField as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  args: {
    label: "Notification preferences",
    options: notificationOptions,
    checkbox: { size: "md" },
  },
  argTypes: {
    checkbox: storybookCheckboxArgTypes,
  },
}

export default meta

type Story = StoryObj<CheckboxGroupFieldProps>

export const GroupRecommended: Story = {}

export const GroupWithDescription: Story = {
  args: {
    description: "Choose every channel you want us to use when contacting you.",
  },
}

export const GroupWithError: Story = {
  args: {
    error: "Select at least one notification channel.",
  },
}

export const GroupDisabled: Story = {
  args: {
    description: "Notification preferences are managed by your workspace admin.",
    defaultValue: ["email"],
    disabled: true,
  },
}

export const GroupControlled: Story = {
  render: () => ({
    components: { CheckboxGroupField, Paragraph },
    setup() {
      const value = ref(["email"])
      return { value, notificationOptions }
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <CheckboxGroupField
          label="Notification preferences"
          description="Control which alerts we send."
          :options="notificationOptions"
          :modelValue="value"
          @update:modelValue="value = $event"
        />
        <Paragraph size="sm">
          Selected: {{ value.length > 0 ? value.join(", ") : "none" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const GroupWithIndeterminateParent: Story = {
  render: () => ({
    components: { CheckboxGroupField },
    setup() {
      const selectedChildren = ref(["drafts"])
      const allSelected = computed(
        () => selectedChildren.value.length === selectAllChildOptions.length,
      )
      const isMixed = computed(() => selectedChildren.value.length > 0 && !allSelected.value)
      const options = computed(() => [
        { value: "all", label: "Select all", indeterminate: isMixed.value },
        ...selectAllChildOptions,
      ])
      const value = computed(() =>
        allSelected.value ? ["all", ...selectedChildren.value] : selectedChildren.value,
      )

      const handleChange = (nextValue: string[]) => {
        if (nextValue.includes("all")) {
          selectedChildren.value = selectAllChildOptions.map((option) => option.value)
          return
        }

        selectedChildren.value = nextValue.filter((optionValue) => optionValue !== "all")
      }

      return { options, value, handleChange }
    },
    template: `
      <CheckboxGroupField
        label="Bulk selection"
        description="Use the parent checkbox to toggle every mailbox."
        :options="options"
        :modelValue="value"
        @update:modelValue="handleChange"
      />
    `,
  }),
}
