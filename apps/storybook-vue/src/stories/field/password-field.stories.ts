import { PasswordField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/PasswordField",
  component: PasswordField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const PasswordExample: Story = {
  args: {
    label: "Password",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => ({
    components: { PasswordField },
    setup() {
      const password = ref("")
      return { args, password }
    },
    template: `
      <div style="width: 320px;">
        <PasswordField v-bind="args" v-model="password" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current password: {{ password || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  args: {
    label: "Password",
    helperText: "Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => ({
    components: { PasswordField },
    setup() {
      const password = ref("")
      return { args, password }
    },
    template: `
      <div style="width: 320px;">
        <PasswordField v-bind="args" v-model="password" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => ({
    components: { PasswordField },
    setup() {
      const password = ref("weak")
      return { args, password }
    },
    template: `
      <div style="width: 320px;">
        <PasswordField v-bind="args" v-model="password" />
      </div>
    `,
  }),
}

export const NewPassword: Story = {
  args: {
    label: "New Password",
    autoComplete: "new-password",
    helperText: "Choose a strong password for your account",
    input: {
      placeholder: "Enter your new password",
    },
  },
  render: (args) => ({
    components: { PasswordField },
    setup() {
      const password = ref("")
      return { args, password }
    },
    template: `
      <div style="width: 320px;">
        <PasswordField v-bind="args" v-model="password" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Password",
    input: {
      value: "••••••••",
      disabled: true,
    },
  },
  render: (args) => ({
    components: { PasswordField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <PasswordField v-bind="args" />
      </div>
    `,
  }),
}

export const PasswordConfirmation: Story = {
  render: () => ({
    components: { PasswordField },
    setup() {
      const password = ref("")
      const confirmPassword = ref("")
      return { password, confirmPassword }
    },
    template: `
      <div style="width: 320px; display: grid; gap: 24px;">
        <PasswordField label="New Password" autoComplete="new-password" v-model="password" />
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          v-model="confirmPassword"
          :error="confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''"
        />
      </div>
    `,
  }),
}
