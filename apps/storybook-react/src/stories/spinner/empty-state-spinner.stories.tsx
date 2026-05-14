import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { EmptyStateSpinner, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

const meta = {
  title: "Spinner/Molecule/EmptyStateSpinner",
  component: EmptyStateSpinner,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        minWidth: "320px",
        minHeight: "220px",
        padding: "2rem",
        borderRadius: "16px",
        background: "rgba(248, 250, 252, 0.88)",
        boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.35)",
      }}
    >
      <EmptyStateSpinner
        {...args}
        style={{ "--mw-spinner-indicator-color": "#5859fc" } as React.CSSProperties}
      />
      <Paragraph size="sm" style={{ margin: 0, color: "#111827" }}>
        Loading your data
      </Paragraph>
    </div>
  ),
} satisfies Meta<typeof EmptyStateSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
