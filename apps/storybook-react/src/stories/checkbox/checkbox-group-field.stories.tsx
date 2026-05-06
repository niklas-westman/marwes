import { storybookA11yPolicy, storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import { CheckboxGroupField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

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

const meta: Meta<typeof CheckboxGroupField> = {
  title: "Checkbox/Molecule/CheckboxGroupField",
  component: CheckboxGroupField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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

type Story = StoryObj<typeof CheckboxGroupField>

export const GroupRecommended: Story = {
  render: (args) => <CheckboxGroupField {...args} />,
}

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
  render: () => {
    const [value, setValue] = useState<string[]>(["email"])

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <CheckboxGroupField
          label="Notification preferences"
          description="Control which alerts we send."
          value={value}
          onChange={setValue}
          options={notificationOptions}
        />
        <Paragraph size="sm">Selected: {value.length > 0 ? value.join(", ") : "none"}</Paragraph>
      </div>
    )
  },
}

export const GroupWithIndeterminateParent: Story = {
  render: () => {
    const [selectedChildren, setSelectedChildren] = useState<string[]>(["drafts"])
    const allSelected = selectedChildren.length === selectAllChildOptions.length
    const isMixed = selectedChildren.length > 0 && !allSelected

    const options = [
      { value: "all", label: "Select all", indeterminate: isMixed },
      ...selectAllChildOptions,
    ]

    const value = allSelected ? ["all", ...selectedChildren] : selectedChildren

    return (
      <CheckboxGroupField
        label="Bulk selection"
        description="Use the parent checkbox to toggle every mailbox."
        options={options}
        value={value}
        onChange={(nextValue) => {
          if (nextValue.includes("all")) {
            setSelectedChildren(selectAllChildOptions.map((option) => option.value))
            return
          }

          setSelectedChildren(nextValue.filter((optionValue) => optionValue !== "all"))
        }}
      />
    )
  },
}
