import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackItemProps } from "@marwes-ui/vue"
import { Stack, StackItem, stackSizings } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

// Demo-only chrome: the outline and tint make the item's box visible.
const frameStyle =
  "width: 520px; border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.6);"
const boxStyle = "padding: 8px 12px; border-radius: 8px; background: rgba(14, 165, 233, 0.16);"

const components = { Stack, StackItem }

const meta = {
  title: "Stack/Item",
  component: StackItem as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    horizontalSizing: { control: "inline-radio", options: [...stackSizings] },
    verticalSizing: { control: "inline-radio", options: [...stackSizings] },
  },
  args: {
    horizontalSizing: "hug",
    verticalSizing: "hug",
  },
  render: (args: StackItemProps) => ({
    components,
    setup() {
      return { args, frameStyle, boxStyle }
    },
    template: `
      <div :style="frameStyle">
        <Stack direction="row" gap="sp-12" padding="sp-12">
          <StackItem v-bind="args"><div :style="boxStyle">Controlled item</div></StackItem>
          <StackItem><div :style="boxStyle + ' min-height: 72px;'">Sibling</div></StackItem>
        </Stack>
      </div>
    `,
  }),
} satisfies Meta<StackItemProps>

export default meta
type Story = StoryObj<StackItemProps>

export const Default: Story = {}

export const Fill: Story = {
  args: { horizontalSizing: "fill", verticalSizing: "fill" },
}

export const ListItems: Story = {
  render: () => ({
    components,
    setup() {
      return { steps: ["Draft", "Review", "Publish"], frameStyle, boxStyle }
    },
    template: `
      <div :style="frameStyle">
        <Stack as="ul" gap="sp-8" padding="sp-12" aria-label="Publishing steps">
          <StackItem v-for="step in steps" :key="step" as="li" horizontal-sizing="fill">
            <div :style="boxStyle">{{ step }}</div>
          </StackItem>
        </Stack>
      </div>
    `,
  }),
}
