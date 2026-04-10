import { storybookLayout } from "@marwes-ui/core"
import type { EmptyStateSpinnerProps } from "@marwes-ui/vue"
import { EmptyStateSpinner, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Spinner/Molecule/EmptyStateSpinner",
  component: EmptyStateSpinner as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  render: (args: EmptyStateSpinnerProps) => ({
    components: { EmptyStateSpinner, Paragraph },
    setup() {
      return {
        args,
        spinnerVars: {
          "--mw-spinner-indicator-color": "#5859fc",
        },
      }
    },
    template: `
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; min-width: 320px; min-height: 220px; padding: 2rem; border-radius: 16px; background: #141414;"
      >
        <EmptyStateSpinner v-bind="args" :style="spinnerVars" />
        <Paragraph size="sm" style="margin: 0; color: #f9fafb;">Loading your data</Paragraph>
      </div>
    `,
  }),
} satisfies Meta<EmptyStateSpinnerProps>

export default meta
type Story = StoryObj<EmptyStateSpinnerProps>

export const Default: Story = {}
