import { storybookLayout } from "@marwes-ui/core"
import { Badge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Data Display/Atom/Badge",
  component: Badge,
  parameters: {
    ...storybookLayout.centered,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { variant: "neutral", children: "Neutral" } }
export const Info: Story = { args: { variant: "info", children: "Info" } }
export const Success: Story = { args: { variant: "success", children: "Success" } }
export const Warning: Story = { args: { variant: "warning", children: "Warning" } }
export const ErrorVariant: Story = { args: { variant: "error", children: "Error" } }
