import { storybookLayout } from "@marwes-ui/core"
import { Slider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Slider/Atom",
  component: Slider,
  parameters: { ...storybookLayout.padded },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 50, min: 0, max: 100 } }
export const WithStep: Story = { args: { value: 25, min: 0, max: 100, step: 25 } }
export const Disabled: Story = { args: { value: 30, disabled: true } }
