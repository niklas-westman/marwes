import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { RadioGroupField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const colorOptions = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
]

const meta = {
  title: "Radio/Molecule",
  component: RadioGroupField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroupField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "color",
    label: "Favorite color",
    options: colorOptions,
    defaultValue: "red",
  },
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
