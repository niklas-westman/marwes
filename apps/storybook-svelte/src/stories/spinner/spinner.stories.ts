import { storybookA11yPolicy, storybookLayout, storybookSpinnerArgTypes } from "@marwes-ui/core"
import { Spinner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Spinner/Atom",
  component: Spinner,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSpinnerArgTypes,
  args: {
    variant: "classic",
    size: "sm",
    decorative: true,
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Classic: Story = { args: { variant: "classic", size: "md" } }
export const Ring: Story = { args: { variant: "ring", size: "md" } }
export const Dual: Story = { args: { variant: "dual", size: "md" } }
export const DotsRound: Story = { args: { variant: "dots-round", size: "md" } }
export const DotsSquare: Story = { args: { variant: "dots-square", size: "md" } }
export const Lines: Story = { args: { variant: "lines", size: "md" } }
export const Cross: Story = { args: { variant: "cross", size: "md" } }
export const Small: Story = { args: { variant: "classic", size: "sm" } }
export const Large: Story = { args: { variant: "classic", size: "lg" } }

export const AccessibleStatus: Story = {
  args: { decorative: false, ariaLabel: "Loading account data" },
}
