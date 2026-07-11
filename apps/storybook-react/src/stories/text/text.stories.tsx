import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Text } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Text/Atom",
  component: Text,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["display", "label", "label-small", "caption", "overline", "micro"],
    },
    as: {
      control: "select",
      options: ["span", "div", "label", "small", "strong"],
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Caption text",
  },
}

export const Label: Story = {
  args: {
    variant: "label",
    children: "Field label",
  },
}

export const LabelSmall: Story = {
  args: {
    variant: "label-small",
    children: "Compact label",
  },
}

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Supporting caption",
  },
}

export const Overline: Story = {
  args: {
    variant: "overline",
    children: "Section marker",
  },
}

export const Micro: Story = {
  args: {
    variant: "micro",
    children: "Tiny metadata",
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "12px" }}>
      <Text variant="display">Display</Text>
      <Text variant="label">Label default</Text>
      <Text variant="label-small">Label small</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="overline">Overline</Text>
      <Text variant="micro">Micro</Text>
    </div>
  ),
}
