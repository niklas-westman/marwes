import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { TextProps } from "@marwes-ui/vue"
import { Text } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Text/Atom",
  component: Text as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["display", "label", "label-small", "caption", "overline", "micro"],
    },
    as: {
      control: "select",
      options: ["span", "div", "label", "small", "strong"],
    },
  },
} satisfies Meta<TextProps>

export default meta
type Story = StoryObj<TextProps>

export const Default: Story = {
  render: () => ({
    components: { Text },
    template: "<Text>Caption text</Text>",
  }),
}

export const Label: Story = {
  render: () => ({
    components: { Text },
    template: '<Text variant="label">Field label</Text>',
  }),
}

export const LabelSmall: Story = {
  render: () => ({
    components: { Text },
    template: '<Text variant="label-small">Compact label</Text>',
  }),
}

export const Caption: Story = {
  render: () => ({
    components: { Text },
    template: '<Text variant="caption">Supporting caption</Text>',
  }),
}

export const Overline: Story = {
  render: () => ({
    components: { Text },
    template: '<Text variant="overline">Section marker</Text>',
  }),
}

export const Micro: Story = {
  render: () => ({
    components: { Text },
    template: '<Text variant="micro">Tiny metadata</Text>',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Text },
    template: `
      <div style="display: grid; gap: 12px;">
        <Text variant="display">Display</Text>
        <Text variant="label">Label default</Text>
        <Text variant="label-small">Label small</Text>
        <Text variant="caption">Caption</Text>
        <Text variant="overline">Overline</Text>
        <Text variant="micro">Micro</Text>
      </div>
    `,
  }),
}
