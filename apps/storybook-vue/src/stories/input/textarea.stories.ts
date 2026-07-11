import { storybookA11yPolicy } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
// Atom is no longer publicly exported; deep-import for story documentation.
import {
  Textarea,
  type TextareaProps,
} from "../../../../../packages/vue/src/components/input/textarea"

const meta = {
  title: "Input/Atom/Textarea",
  component: Textarea as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Details",
    placeholder: "Add more detail...",
    rows: 4,
  },
} satisfies Meta<TextareaProps>

export default meta

type Story = StoryObj<TextareaProps>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => ({
    components: { Textarea, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <Textarea v-bind="args" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: "This description is locked.",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    modelValue: "Needs more detail",
    describedBy: "textarea-error",
  },
  render: (args) => ({
    components: { Textarea, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <Textarea v-bind="args" />
        <Paragraph id="textarea-error" size="sm" style="margin-top: 8px;">
          Invalid state for validation errors.
        </Paragraph>
      </div>
    `,
  }),
}
