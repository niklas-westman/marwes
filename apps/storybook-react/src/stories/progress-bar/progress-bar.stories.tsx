import { storybookA11yPolicy, storybookLayout, storybookProgressBarArgTypes } from "@marwes-ui/core"
import { ProgressBar, type ProgressBarProps } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

const stackStyle = {
  display: "grid",
  gap: "1.5rem",
  width: "min(560px, 100%)",
} satisfies React.CSSProperties

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "8rem minmax(15rem, 1fr)",
  gap: "1.5rem",
  alignItems: "center",
} satisfies React.CSSProperties

function ProgressBarStateGallery(): React.ReactElement {
  const rows: Array<[string, ProgressBarProps]> = [
    ["Default", { value: 60 }],
    ["Hover", { value: 60, state: "hover" }],
    ["Pressed", { value: 60, state: "pressed" }],
    ["Disabled", { value: 60, disabled: true }],
    ["Focus", { value: 60, state: "focus" }],
  ]

  return (
    <div style={stackStyle}>
      {rows.map(([name, props]) => (
        <div key={name} style={rowStyle}>
          <span>{name}</span>
          <ProgressBar {...props} label="Progress" />
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: "ProgressBar/Atom",
  component: ProgressBar,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookProgressBarArgTypes,
  args: {
    label: "Progress",
    value: 60,
    min: 0,
    max: 100,
    size: "small",
    state: "default",
    showLabel: true,
    showPercentage: true,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargeTrack: Story = {
  args: {
    size: "default",
  },
}

export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    ariaLabel: "Progress",
  },
}

export const WithoutPercentage: Story = {
  args: {
    showPercentage: false,
  },
}

export const StateGallery: Story = {
  render: () => <ProgressBarStateGallery />,
}
