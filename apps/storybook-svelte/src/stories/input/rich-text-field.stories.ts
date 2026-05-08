import { storybookA11yPolicy } from "@marwes-ui/core"
import { RichTextField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Molecule/RichTextField",
  component: RichTextField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Description",
    editor: {
      placeholder: "Enter formatted text...",
    },
  },
} satisfies Meta<typeof RichTextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Basic: Story = {}

export const Controlled: Story = {
  args: {
    editor: { value: "<p><strong>Bold</strong> and <em>italic</em> content</p>" },
  },
}

export const Disabled: Story = {
  args: {
    editor: { disabled: true },
  },
}

export const ReadOnly: Story = {
  args: {
    editor: { readOnly: true, value: "<p>Read-only formatted text.</p>" },
  },
}

export const WithHelperText: Story = {
  args: {
    helperText: "Use the toolbar to format your text.",
  },
}

export const WithError: Story = {
  args: {
    error: "Description is required.",
    editor: {
      placeholder: "Enter formatted text...",
    },
  },
}
