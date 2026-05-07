import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SelectField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

const meta = {
  title: "Input/Molecule/SelectField",
  component: SelectField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Framework",
    select: { options, placeholder: "Select a framework" },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Framework",
    helperText: "Choose your preferred framework.",
    select: { options },
  },
}

export const WithError: Story = {
  args: {
    label: "Framework",
    error: "Please select a framework.",
    select: { options },
  },
}

export const Disabled: Story = {
  args: {
    label: "Framework",
    select: { options, disabled: true },
  },
}
