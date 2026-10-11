import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackProps } from "@marwes-ui/react"
import {
  Paragraph,
  Stack,
  StackItem,
  stackAlignItemsValues,
  stackAsValues,
  stackDirections,
  stackJustifyContentValues,
  stackSizings,
  stackWraps,
} from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

const spacingTokens = [
  "sp-0",
  "sp-2",
  "sp-4",
  "sp-8",
  "sp-12",
  "sp-16",
  "sp-24",
  "sp-32",
  "sp-40",
  "sp-48",
] as const

const spacingArgType = { control: "select", options: spacingTokens } as const

// Demo-only chrome: the outline and tint make the stack's padding and gaps visible.
const frameStyle: React.CSSProperties = {
  width: "520px",
  borderRadius: "12px",
  boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.6)",
}

const boxStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "8px",
  background: "rgba(14, 165, 233, 0.16)",
}

function DemoBox(props: { label: string; style?: React.CSSProperties }) {
  return <div style={{ ...boxStyle, ...props.style }}>{props.label}</div>
}

function ThreeItems() {
  return (
    <>
      <StackItem>
        <DemoBox label="One" />
      </StackItem>
      <StackItem>
        <DemoBox label="Two" style={{ minHeight: "56px" }} />
      </StackItem>
      <StackItem>
        <DemoBox label="Three" />
      </StackItem>
    </>
  )
}

const meta = {
  title: "Stack/Atom",
  component: Stack,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "inline-radio", options: [...stackDirections] },
    gap: spacingArgType,
    rowGap: spacingArgType,
    columnGap: spacingArgType,
    padding: spacingArgType,
    paddingX: spacingArgType,
    paddingY: spacingArgType,
    paddingTop: spacingArgType,
    paddingRight: spacingArgType,
    paddingBottom: spacingArgType,
    paddingLeft: spacingArgType,
    alignItems: { control: "select", options: [...stackAlignItemsValues] },
    justifyContent: { control: "select", options: [...stackJustifyContentValues] },
    wrap: { control: "inline-radio", options: [...stackWraps] },
    horizontalSizing: { control: "inline-radio", options: [...stackSizings] },
    verticalSizing: { control: "inline-radio", options: [...stackSizings] },
    as: { control: "select", options: [...stackAsValues] },
  },
  args: {
    direction: "column",
    gap: "sp-16",
    padding: "sp-16",
  },
  render: (args: StackProps) => (
    <div style={frameStyle}>
      <Stack {...args}>
        <ThreeItems />
      </Stack>
    </div>
  ),
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Directions: Story = {
  render: () => (
    <Stack gap="sp-24">
      {stackDirections.map((direction) => (
        <StackItem key={direction}>
          <Paragraph>direction="{direction}"</Paragraph>
          <div style={frameStyle}>
            <Stack direction={direction} gap="sp-12" padding="sp-12">
              <ThreeItems />
            </Stack>
          </div>
        </StackItem>
      ))}
    </Stack>
  ),
}

export const Gap: Story = {
  render: () => (
    <Stack gap="sp-24">
      {(["sp-4", "sp-16", "sp-32"] as const).map((gap) => (
        <StackItem key={gap}>
          <Paragraph>gap="{gap}"</Paragraph>
          <div style={frameStyle}>
            <Stack direction="row" gap={gap} padding="sp-12">
              <ThreeItems />
            </Stack>
          </div>
        </StackItem>
      ))}
    </Stack>
  ),
}

export const Padding: Story = {
  render: () => (
    <Stack gap="sp-24">
      <StackItem>
        <Paragraph>padding="sp-32"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" padding="sp-32">
            <ThreeItems />
          </Stack>
        </div>
      </StackItem>
      <StackItem>
        <Paragraph>paddingX="sp-48" paddingY="sp-8"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" paddingX="sp-48" paddingY="sp-8">
            <ThreeItems />
          </Stack>
        </div>
      </StackItem>
      <StackItem>
        <Paragraph>padding="sp-8" paddingLeft="sp-48"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" padding="sp-8" paddingLeft="sp-48">
            <ThreeItems />
          </Stack>
        </div>
      </StackItem>
    </Stack>
  ),
}

/**
 * alignItems has no stretch: cross-axis stretching is child fill sizing (see ChildSizing).
 */
export const Alignment: Story = {
  render: () => (
    <Stack gap="sp-24">
      {stackAlignItemsValues.map((alignItems) => (
        <StackItem key={alignItems}>
          <Paragraph>alignItems="{alignItems}"</Paragraph>
          <div style={frameStyle}>
            <Stack direction="row" gap="sp-12" padding="sp-12" alignItems={alignItems}>
              <ThreeItems />
            </Stack>
          </div>
        </StackItem>
      ))}
    </Stack>
  ),
}

export const Justify: Story = {
  render: () => (
    <Stack gap="sp-24">
      {stackJustifyContentValues.map((justifyContent) => (
        <StackItem key={justifyContent}>
          <Paragraph>justifyContent="{justifyContent}"</Paragraph>
          <div style={frameStyle}>
            <Stack direction="row" gap="sp-12" padding="sp-12" justifyContent={justifyContent}>
              <ThreeItems />
            </Stack>
          </div>
        </StackItem>
      ))}
    </Stack>
  ),
}

export const Wrap: Story = {
  render: () => (
    <div style={{ ...frameStyle, width: "280px" }}>
      <Stack direction="row" wrap="wrap" rowGap="sp-8" columnGap="sp-12" padding="sp-12">
        {["Design", "Research", "Frontend", "Backend", "Data", "Platform"].map((label) => (
          <StackItem key={label}>
            <DemoBox label={label} />
          </StackItem>
        ))}
      </Stack>
    </div>
  ),
}

/**
 * fix and hug render the same: the child's own size wins. fill grows on the main axis and
 * stretches on the cross axis.
 */
export const ChildSizing: Story = {
  render: () => (
    <Stack gap="sp-24">
      <StackItem>
        <Paragraph>Row parent</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" padding="sp-12">
            <StackItem horizontalSizing="fix" verticalSizing="fix">
              <DemoBox label="fix" style={{ width: "72px", height: "96px" }} />
            </StackItem>
            <StackItem>
              <DemoBox label="hug" />
            </StackItem>
            <StackItem horizontalSizing="fill" verticalSizing="fill">
              <DemoBox label="fill / fill" />
            </StackItem>
          </Stack>
        </div>
      </StackItem>
      <StackItem>
        <Paragraph>Column parent</Paragraph>
        <div style={frameStyle}>
          <Stack direction="column" gap="sp-12" padding="sp-12">
            <StackItem>
              <DemoBox label="hug" />
            </StackItem>
            <StackItem horizontalSizing="fill">
              <DemoBox label="horizontal fill" />
            </StackItem>
            <StackItem horizontalSizing="fix">
              <DemoBox label="fix" style={{ width: "160px" }} />
            </StackItem>
          </Stack>
        </div>
      </StackItem>
    </Stack>
  ),
}

export const Nested: Story = {
  render: () => (
    <div style={frameStyle}>
      <Stack direction="row" gap="sp-24" padding="sp-16" alignItems="start">
        <Stack gap="sp-8" horizontalSizing="fill">
          <StackItem horizontalSizing="fill">
            <DemoBox label="Nested item one" />
          </StackItem>
          <StackItem horizontalSizing="fill">
            <DemoBox label="Nested item two" />
          </StackItem>
        </Stack>
        <StackItem>
          <DemoBox label="Sibling" />
        </StackItem>
      </Stack>
    </div>
  ),
}
