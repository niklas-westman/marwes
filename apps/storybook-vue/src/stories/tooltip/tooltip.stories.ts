import { storybookLayout } from "@marwes-ui/core"
import type { TooltipProps } from "@marwes-ui/vue"
import { Tooltip } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Tooltip/Atom",
  component: Tooltip as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<TooltipProps>

export default meta

type Story = StoryObj<TooltipProps>

export const Default: Story = {
  render: () => ({
    components: { Tooltip },
    template: "<Tooltip>Tooltip text</Tooltip>",
  }),
}

export const Dark: Story = {
  render: () => ({
    components: { Tooltip },
    template: `
      <div class="mw-theme--dark" style="padding: 24px; background: #2e2e2e; border-radius: 8px;">
        <Tooltip>Tooltip text</Tooltip>
      </div>
    `,
  }),
}
