import { storybookLayout, storybookSpinnerArgTypes } from "@marwes-ui/core"
import type { SpinnerProps } from "@marwes-ui/react"
import { Button, Paragraph, Spinner } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

const panelBorder = "rgba(148, 163, 184, 0.35)"
const stageStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "120px",
  minHeight: "120px",
  padding: "1.5rem",
  borderRadius: "16px",
  background: "rgba(248, 250, 252, 0.88)",
  boxShadow: `inset 0 0 0 1px ${panelBorder}`,
}
const darkStageStyle = {
  ...stageStyle,
  background: "#141414",
}
const tileGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "1rem",
  width: "100%",
  maxWidth: "920px",
}
const tileStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "0.75rem",
}
const spinnerVariantOptions: Array<Exclude<SpinnerProps["variant"], undefined>> = [
  "classic",
  "ring",
  "dual",
  "dots-round",
  "dots-square",
  "lines",
  "cross",
]
const spinnerSizeOptions: Array<{
  token: Exclude<SpinnerProps["size"], undefined>
  label: string
}> = [
  { token: "xs", label: "16px" },
  { token: "sm", label: "24px" },
  { token: "md", label: "32px" },
  { token: "lg", label: "40px" },
  { token: 56, label: "56px" },
]

function SpinnerPreview(args: SpinnerProps) {
  return (
    <div style={stageStyle}>
      <Spinner {...args} />
    </div>
  )
}

const meta = {
  title: "Spinner/Atom",
  component: Spinner,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookSpinnerArgTypes,
  args: {
    variant: "classic",
    size: "sm",
    decorative: true,
  },
  render: (args) => <SpinnerPreview {...args} />,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AccessibleStatus: Story = {
  args: {
    decorative: false,
    ariaLabel: "Loading account data",
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={tileGridStyle}>
      {spinnerVariantOptions.map((variantName) => (
        <div key={variantName} style={tileStyle}>
          <div style={stageStyle}>
            <Spinner variant={variantName} size="sm" />
          </div>
          <Paragraph size="sm" style={{ margin: 0 }}>
            {variantName}
          </Paragraph>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={tileGridStyle}>
      {spinnerSizeOptions.map(({ token, label }) => (
        <div key={String(token)} style={tileStyle}>
          <div style={stageStyle}>
            <Spinner size={token} />
          </div>
          <Paragraph size="sm" style={{ margin: 0 }}>
            {typeof token === "number" ? "custom" : token} — {label}
          </Paragraph>
        </div>
      ))}
    </div>
  ),
}

export const ButtonLoadingTreatment: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary" action="submit" loading>
        Loading…
      </Button>

      <Button variant="secondary" action="button" loading>
        Please wait
      </Button>
    </div>
  ),
}

export const EmptyStateTreatment: Story = {
  render: () => (
    <div style={{ ...darkStageStyle, minWidth: "320px", minHeight: "220px" }}>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
      >
        <Spinner
          variant="dots-round"
          size="lg"
          decorative
          style={{ "--mw-spinner-indicator-color": "#5859fc" } as React.CSSProperties}
        />
        <Paragraph size="sm" style={{ margin: 0, color: "#f9fafb" }}>
          Loading your data
        </Paragraph>
        <Paragraph size="sm" style={{ margin: 0, color: "#a3a3a3" }}>
          This matches the centered empty-state treatment from the Spinner page.
        </Paragraph>
      </div>
    </div>
  ),
}
