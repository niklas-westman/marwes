import type { RichTextProps } from "@marwes-ui/vue"
import { Paragraph, RichText } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Atom/RichText",
  component: RichText as unknown as object,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Write a formatted description...",
  },
} satisfies Meta<RichTextProps>

export default meta

type Story = StoryObj<RichTextProps>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => ({
    components: { RichText, Paragraph },
    setup() {
      const value = ref("<p>Hello <strong>world</strong></p>")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichText v-bind="args" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current HTML: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: "<p><strong>Locked</strong> formatted content</p>",
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    modelValue: "<p><em>Read-only</em> summary with <u>underline</u></p>",
  },
}

export const LimitedFormats: Story = {
  args: {
    allowedFormats: ["bold", "italic"],
    modelValue: "<p>Underline is intentionally disabled in this example.</p>",
  },
}
