import { storybookA11yPolicy } from "@marwes-ui/core"
import type { InputProps } from "@marwes-ui/vue"
import { Input, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Atom/Input",
  component: Input as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Text input",
    placeholder: "Enter text...",
  },
} satisfies Meta<InputProps>

export default meta

type Story = StoryObj<InputProps>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => ({
    components: { Input, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <Input v-bind="args" v-model="value" />
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
    modelValue: "Disabled value",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    modelValue: "Invalid input",
    describedBy: "input-error",
  },
  render: (args) => ({
    components: { Input, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <Input v-bind="args" />
        <Paragraph id="input-error" size="sm" style="margin-top: 8px;">
          Invalid state for validation errors.
        </Paragraph>
      </div>
    `,
  }),
}
