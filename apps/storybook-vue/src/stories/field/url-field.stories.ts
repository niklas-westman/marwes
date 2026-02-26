import { URLField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/URLField",
  component: URLField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof URLField>

export default meta
type Story = StoryObj<typeof meta>

export const URLExample: Story = {
  args: {
    label: "Website",
    input: {
      placeholder: "https://example.com",
    },
  },
  render: (args) => ({
    components: { URLField },
    setup() {
      const url = ref("")
      return { args, url }
    },
    template: `
      <div style="width: 320px;">
        <URLField v-bind="args" v-model="url" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current URL: {{ url || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  args: {
    label: "Website",
    helperText: "Include https:// or http:// protocol",
    input: {
      placeholder: "https://example.com",
    },
  },
  render: (args) => ({
    components: { URLField },
    setup() {
      const url = ref("")
      return { args, url }
    },
    template: `
      <div style="width: 320px;">
        <URLField v-bind="args" v-model="url" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Website",
    error: "Please enter a valid URL (must include protocol)",
  },
  render: (args) => ({
    components: { URLField },
    setup() {
      const url = ref("example")
      return { args, url }
    },
    template: `
      <div style="width: 320px;">
        <URLField v-bind="args" v-model="url" />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Portfolio website *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => ({
    components: { URLField },
    setup() {
      const url = ref("")
      return { args, url }
    },
    template: `
      <div style="width: 320px;">
        <URLField v-bind="args" v-model="url" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Website",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { URLField },
    setup() {
      const url = ref("https://example.com")
      return { args, url }
    },
    template: `
      <div style="width: 320px;">
        <URLField v-bind="args" v-model="url" />
      </div>
    `,
  }),
}
