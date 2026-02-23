import { Divider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    size: "md",
    orientation: "horizontal",
    style: { width: "320px" },
  },
}

export const Vertical: Story = {
  render: (args) => ({
    components: { Divider },
    setup() {
      return { args }
    },
    template: `
      <div style="display:flex; align-items:center; gap:16px; height:96px;">
        <span>Left</span>
        <Divider v-bind="args" orientation="vertical" size="sm" />
        <span>Right</span>
      </div>
    `,
  }),
}
