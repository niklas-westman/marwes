import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CheckboxGroupField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Checkbox/Molecule/CheckboxGroupField",
  component: CheckboxGroupField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroupField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Select your interests",
    options: [
      { value: "design", label: "Design" },
      { value: "engineering", label: "Engineering" },
      { value: "product", label: "Product" },
    ],
  },
}

export const WithError: Story = {
  args: {
    label: "Select at least one",
    error: "Please select at least one option.",
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ],
  },
}

export const Disabled: Story = {
  args: {
    label: "Locked preferences",
    disabled: true,
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ],
  },
}
