import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DropdownField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const meta = {
  title: "Input/Purpose/DropdownField",
  component: DropdownField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Country",
    select: { options, placeholder: "Choose a country" },
  },
}

export const Basic: Story = {
  args: {
    label: "Country",
    select: { options, placeholder: "Choose a country" },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Country",
    helperText: "Where are you located?",
    select: { options, placeholder: "Choose a country" },
  },
}

export const WithError: Story = {
  args: {
    label: "Country",
    error: "Please select a country.",
    select: { options },
  },
}

export const Disabled: Story = {
  args: {
    label: "Country",
    select: { options, disabled: true, placeholder: "Choose a country" },
  },
}

export const Controlled: Story = {
  args: {
    label: "Country",
    select: { options, value: "se", placeholder: "Choose a country" },
  },
}

export const Native: Story = {
  args: {
    label: "Country",
    select: { options, native: true, placeholder: "Choose a country" },
  },
}
