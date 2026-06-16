import { storybookA11yPolicy } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
// Atom is no longer publicly exported; deep-import for story documentation.
import RichText from "../../../../../packages/svelte/src/lib/components/input/RichText.svelte"

const meta = {
  title: "Input/Atom/RichText",
  component: RichText,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Formatted description",
    placeholder: "Write a formatted description...",
  },
} satisfies Meta<typeof RichText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Basic: Story = {}

export const Controlled: Story = {
  args: {
    value: "<p><strong>Bold</strong> and <em>italic</em> content</p>",
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "<p>Read-only content.</p>",
  },
}

export const LimitedFormats: Story = {
  args: {
    formats: ["bold", "italic"],
    placeholder: "Only bold and italic formatting available...",
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Start typing here...",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "<p><strong>Locked</strong> formatted content</p>",
  },
}
