import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackProps } from "@marwes-ui/vue"
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
} from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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
const frameStyle =
  "width: 520px; border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.6);"
const boxStyle = "padding: 8px 12px; border-radius: 8px; background: rgba(14, 165, 233, 0.16);"

const threeItems = `
  <StackItem><div :style="boxStyle">One</div></StackItem>
  <StackItem><div :style="boxStyle + ' min-height: 56px;'">Two</div></StackItem>
  <StackItem><div :style="boxStyle">Three</div></StackItem>
`

const components = { Paragraph, Stack, StackItem }

const meta = {
  title: "Stack/Atom",
  component: Stack as unknown as object,
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
  render: (args: StackProps) => ({
    components,
    setup() {
      return { args, frameStyle, boxStyle }
    },
    template: `
      <div :style="frameStyle">
        <Stack v-bind="args">${threeItems}</Stack>
      </div>
    `,
  }),
} satisfies Meta<StackProps>

export default meta
type Story = StoryObj<StackProps>

export const Default: Story = {}

export const Directions: Story = {
  render: () => ({
    components,
    setup() {
      return { directions: stackDirections, frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem v-for="direction in directions" :key="direction">
          <Paragraph>direction="{{ direction }}"</Paragraph>
          <div :style="frameStyle">
            <Stack :direction="direction" gap="sp-12" padding="sp-12">${threeItems}</Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Gap: Story = {
  render: () => ({
    components,
    setup() {
      return { gaps: ["sp-4", "sp-16", "sp-32"], frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem v-for="gap in gaps" :key="gap">
          <Paragraph>gap="{{ gap }}"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" :gap="gap" padding="sp-12">${threeItems}</Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Padding: Story = {
  render: () => ({
    components,
    setup() {
      return { frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem>
          <Paragraph>padding="sp-32"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding="sp-32">${threeItems}</Stack>
          </div>
        </StackItem>
        <StackItem>
          <Paragraph>paddingX="sp-48" paddingY="sp-8"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding-x="sp-48" padding-y="sp-8">${threeItems}</Stack>
          </div>
        </StackItem>
        <StackItem>
          <Paragraph>padding="sp-8" paddingLeft="sp-48"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding="sp-8" padding-left="sp-48">${threeItems}</Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Alignment: Story = {
  render: () => ({
    components,
    setup() {
      return { values: stackAlignItemsValues, frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem v-for="value in values" :key="value">
          <Paragraph>alignItems="{{ value }}"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding="sp-12" :align-items="value">${threeItems}</Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Justify: Story = {
  render: () => ({
    components,
    setup() {
      return { values: stackJustifyContentValues, frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem v-for="value in values" :key="value">
          <Paragraph>justifyContent="{{ value }}"</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding="sp-12" :justify-content="value">${threeItems}</Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Wrap: Story = {
  render: () => ({
    components,
    setup() {
      return {
        labels: ["Design", "Research", "Frontend", "Backend", "Data", "Platform"],
        frameStyle: `${frameStyle} width: 280px;`,
        boxStyle,
      }
    },
    template: `
      <div :style="frameStyle">
        <Stack direction="row" wrap="wrap" row-gap="sp-8" column-gap="sp-12" padding="sp-12">
          <StackItem v-for="label in labels" :key="label">
            <div :style="boxStyle">{{ label }}</div>
          </StackItem>
        </Stack>
      </div>
    `,
  }),
}

/**
 * fix and hug render the same: the child's own size wins. fill grows on the main axis and
 * stretches on the cross axis.
 */
export const ChildSizing: Story = {
  render: () => ({
    components,
    setup() {
      return { frameStyle, boxStyle }
    },
    template: `
      <Stack gap="sp-24">
        <StackItem>
          <Paragraph>Row parent</Paragraph>
          <div :style="frameStyle">
            <Stack direction="row" gap="sp-12" padding="sp-12">
              <StackItem horizontal-sizing="fix" vertical-sizing="fix">
                <div :style="boxStyle + ' width: 72px; height: 96px;'">fix</div>
              </StackItem>
              <StackItem><div :style="boxStyle">hug</div></StackItem>
              <StackItem horizontal-sizing="fill" vertical-sizing="fill">
                <div :style="boxStyle">fill / fill</div>
              </StackItem>
            </Stack>
          </div>
        </StackItem>
        <StackItem>
          <Paragraph>Column parent</Paragraph>
          <div :style="frameStyle">
            <Stack direction="column" gap="sp-12" padding="sp-12">
              <StackItem><div :style="boxStyle">hug</div></StackItem>
              <StackItem horizontal-sizing="fill"><div :style="boxStyle">horizontal fill</div></StackItem>
              <StackItem horizontal-sizing="fix">
                <div :style="boxStyle + ' width: 160px;'">fix</div>
              </StackItem>
            </Stack>
          </div>
        </StackItem>
      </Stack>
    `,
  }),
}

export const Nested: Story = {
  render: () => ({
    components,
    setup() {
      return { frameStyle, boxStyle }
    },
    template: `
      <div :style="frameStyle">
        <Stack direction="row" gap="sp-24" padding="sp-16" align-items="start">
          <Stack gap="sp-8" horizontal-sizing="fill">
            <StackItem horizontal-sizing="fill"><div :style="boxStyle">Nested item one</div></StackItem>
            <StackItem horizontal-sizing="fill"><div :style="boxStyle">Nested item two</div></StackItem>
          </Stack>
          <StackItem><div :style="boxStyle">Sibling</div></StackItem>
        </Stack>
      </div>
    `,
  }),
}
