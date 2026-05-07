import { storybookA11yPolicy, storybookDividerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DividerPreview from "./DividerPreview.svelte"

const meta = {
  title: "Divider/Atom",
  component: DividerPreview,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookDividerArgTypes,
  args: {
    size: "md",
    orientation: "horizontal",
  },
} satisfies Meta<typeof DividerPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hairline: Story = { args: { size: "xxs" } }
export const Small: Story = { args: { size: "sm" } }
export const Large: Story = { args: { size: "lg" } }
export const ExtraLarge: Story = { args: { size: "xxl" } }

export const Vertical: Story = {
  args: { orientation: "vertical", size: "sm" },
}
