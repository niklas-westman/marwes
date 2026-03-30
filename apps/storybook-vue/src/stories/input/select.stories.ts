import type { SelectProps } from "@marwes-ui/vue"
import { Paragraph, Select } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "enterprise", label: "Enterprise" },
]

const FIGMA_SELECT_NODE = "1364:7707"

const meta = {
  title: "Input/Atom/Select",
  component: Select as unknown as object,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Compact select atom. Use native={false} for the Marwes visual treatment from Figma node ${FIGMA_SELECT_NODE}, or native={true} for platform chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the compact Marwes select atom (${FIGMA_SELECT_NODE}) or native={true} for browser chrome.`,
    },
  },
  args: {
    native: false,
    placeholder: "Choose a plan",
    options,
  },
} satisfies Meta<SelectProps>

export default meta

type Story = StoryObj<SelectProps>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => ({
    components: { Select, Paragraph },
    setup() {
      const value = ref("growth")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <Select v-bind="args" v-model="value" />
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
    defaultValue: "growth",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "starter",
    describedBy: "select-error",
  },
  render: (args) => ({
    components: { Select, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <Select v-bind="args" />
        <Paragraph id="select-error" size="sm" style="margin-top: 8px;">
          Invalid state for validation errors.
        </Paragraph>
      </div>
    `,
  }),
}
