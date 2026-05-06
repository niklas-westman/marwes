import { storybookA11yPolicy } from "@marwes-ui/core"
import type { InputOtpProps } from "@marwes-ui/vue"
import { InputOtp, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Molecule/InputOtp",
  component: InputOtp as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    length: 6,
  },
} satisfies Meta<InputOtpProps>

export default meta

type Story = StoryObj<InputOtpProps>

export const Basic: Story = {
  render: (args) => ({
    components: { InputOtp },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtp v-bind="args" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: (args) => ({
    components: { InputOtp, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputOtp v-bind="args" v-model="value" />
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
    modelValue: "123456",
    helperText: "This code has already been submitted",
  },
  render: (args) => ({
    components: { InputOtp },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtp v-bind="args" />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: {
    modelValue: "1234",
    error: "Code expired",
  },
  render: (args) => ({
    components: { InputOtp },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtp v-bind="args" />
      </div>
    `,
  }),
}
