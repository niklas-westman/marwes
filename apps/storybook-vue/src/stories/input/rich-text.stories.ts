import { storybookA11yPolicy } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
// Atom is no longer publicly exported; deep-import for story documentation.
import {
  RichText,
  type RichTextProps,
} from "../../../../../packages/vue/src/components/input/rich-text"

const meta = {
  title: "Input/Atom/RichText",
  component: RichText as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
    docs: {
      description: {
        component:
          "Rich text editor for the Input family. This is a manual-review-heavy component: automated tests protect naming, readonly/disabled semantics, and basic formatting affordances, but real editing behavior should still be checked in supported browser and assistive technology combinations.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Formatted description",
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
