import { EmailField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/EmailField",
  component: EmailField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmailField>

export default meta
type Story = StoryObj<typeof meta>

export const EmailExample: Story = {
  args: {
    label: "Email address",
    input: {
      placeholder: "you@example.com",
    },
  },
  render: (args) => ({
    components: { EmailField },
    setup() {
      const email = ref("")
      return { args, email }
    },
    template: `
      <div style="width: 320px;">
        <EmailField v-bind="args" v-model="email" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current email: {{ email || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  args: {
    label: "Email address",
    helperText: "We'll never share your email with anyone else",
    input: {
      placeholder: "you@example.com",
    },
  },
  render: (args) => ({
    components: { EmailField },
    setup() {
      const email = ref("")
      return { args, email }
    },
    template: `
      <div style="width: 320px;">
        <EmailField v-bind="args" v-model="email" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Email address",
  },
  render: (args) => ({
    components: { EmailField },
    setup() {
      const email = ref("invalid-email")
      return { args, email }
    },
    template: `
      <div style="width: 320px;">
        <EmailField
          v-bind="args"
          v-model="email"
          :error="email.length > 0 && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ? 'Please enter a valid email address' : ''"
        />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Email address *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => ({
    components: { EmailField },
    setup() {
      const email = ref("")
      return { args, email }
    },
    template: `
      <div style="width: 320px;">
        <EmailField v-bind="args" v-model="email" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Email address",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { EmailField },
    setup() {
      const email = ref("user@example.com")
      return { args, email }
    },
    template: `
      <div style="width: 320px;">
        <EmailField v-bind="args" v-model="email" />
      </div>
    `,
  }),
}
