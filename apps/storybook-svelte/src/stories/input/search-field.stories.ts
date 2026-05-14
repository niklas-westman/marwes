import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SearchField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/SearchField",
  component: SearchField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Search",
    input: { placeholder: "Search..." },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Search products",
    helperText: "Type to filter products, click X to clear.",
    input: { placeholder: "Enter product name..." },
  },
}

export const WithError: Story = {
  args: {
    label: "Search",
    error: "Minimum 3 characters required.",
    input: { placeholder: "Search..." },
  },
}

export const Disabled: Story = {
  args: {
    label: "Search",
    helperText: "Search is temporarily disabled.",
    input: { placeholder: "Search...", disabled: true },
  },
}

export const ReadOnly: Story = {
  args: {
    label: "Search",
    input: { placeholder: "Search...", readOnly: true, value: "Current search" },
  },
}

export const SearchExample: Story = {
  args: {
    label: "Search products",
    input: { placeholder: "Type to search..." },
  },
}
