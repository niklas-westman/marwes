import type { TextareaFieldProps } from "@marwes-ui/vue"
import { Paragraph, TextareaField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Molecule/TextareaField",
  component: TextareaField as unknown as object,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Description",
    textarea: {
      placeholder: "Add more detail...",
      rows: 4,
    },
  },
} satisfies Meta<TextareaFieldProps>

export default meta

type Story = StoryObj<TextareaFieldProps>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Use 2-3 sentences so reviewers have enough context.",
  },
  render: (args) => ({
    components: { TextareaField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <TextareaField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    error: "Description is required.",
  },
  render: (args) => ({
    components: { TextareaField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <TextareaField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    textarea: {
      disabled: true,
      rows: 4,
    },
  },
  render: (args) => ({
    components: { TextareaField },
    setup() {
      const value = ref("Locked content")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <TextareaField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const ReadOnly: Story = {
  args: {
    textarea: {
      readOnly: true,
      rows: 4,
    },
  },
  render: (args) => ({
    components: { TextareaField },
    setup() {
      const value = ref("Read-only summary")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <TextareaField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  args: {
    helperText: "Type something to see the controlled value",
  },
  render: (args) => ({
    components: { TextareaField, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <TextareaField v-bind="args" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}
