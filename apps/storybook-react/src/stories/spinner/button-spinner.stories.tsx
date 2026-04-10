import { storybookLayout } from "@marwes-ui/core"
import { Button, ButtonSpinner } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const stageStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "120px",
  minHeight: "120px",
  padding: "1.5rem",
  borderRadius: "16px",
  background: "rgba(248, 250, 252, 0.88)",
}

const meta = {
  title: "Spinner/Molecule/ButtonSpinner",
  component: ButtonSpinner,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  render: (args) => (
    <div style={stageStyle}>
      <Button variant="secondary" disabled>
        <ButtonSpinner {...args} />
        Please wait
      </Button>
    </div>
  ),
} satisfies Meta<typeof ButtonSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Inverted: Story = {
  args: {
    inverted: true,
  },
  render: (args) => (
    <div style={{ ...stageStyle, background: "rgba(248, 250, 252, 0.88)" }}>
      <Button variant="primary" disabled>
        <ButtonSpinner {...args} />
        Loading…
      </Button>
    </div>
  ),
}
