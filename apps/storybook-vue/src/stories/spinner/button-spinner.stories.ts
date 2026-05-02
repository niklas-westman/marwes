import { storybookLayout } from "@marwes-ui/core"
import type { ButtonSpinnerProps } from "@marwes-ui/vue"
import { Button, ButtonSpinner } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const stageStyle = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 120px;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.88);
`

const meta = {
  title: "Spinner/Molecule/ButtonSpinner",
  component: ButtonSpinner as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  render: (args: ButtonSpinnerProps) => ({
    components: { Button, ButtonSpinner },
    setup() {
      return { args, stageStyle }
    },
    template: `
      <div :style="stageStyle">
        <Button variant="secondary" disabled>
          <ButtonSpinner v-bind="args" />
          Please wait
        </Button>
      </div>
    `,
  }),
} satisfies Meta<ButtonSpinnerProps>

export default meta
type Story = StoryObj<ButtonSpinnerProps>

export const Default: Story = {}

export const Inverted: Story = {
  args: {
    inverted: true,
  },
  render: (args: ButtonSpinnerProps) => ({
    components: { Button, ButtonSpinner },
    setup() {
      return {
        args,
        invertedStageStyle: stageStyle,
      }
    },
    template: `
      <div :style="invertedStageStyle">
        <Button variant="primary" disabled>
          <ButtonSpinner v-bind="args" />
          Loading…
        </Button>
      </div>
    `,
  }),
}
