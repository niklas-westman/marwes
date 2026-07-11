import { storybookA11yPolicy } from "@marwes-ui/core"
import { InputOtpField, Paragraph } from "@marwes-ui/vue"
import type { InputOtpFieldProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Molecule/InputOtpField",
  component: InputOtpField as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    inputOtp: { length: 6 },
  },
} satisfies Meta<InputOtpFieldProps>

export default meta

type Story = StoryObj<InputOtpFieldProps>

export const Basic: Story = {
  render: (args) => ({
    components: { InputOtpField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtpField v-bind="args" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: (args) => ({
    components: { InputOtpField, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputOtpField :label="args.label" :helperText="args.helperText" :inputOtp="{ ...(args.inputOtp ?? {}), modelValue: value, 'onUpdate:modelValue': (v) => value = v }" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    helperText: "This code has already been submitted",
    inputOtp: { length: 6, disabled: true, modelValue: "123456" },
  },
  render: (args) => ({
    components: { InputOtpField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtpField v-bind="args" />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: {
    error: "Code expired",
    inputOtp: { length: 6, modelValue: "1234" },
  },
  render: (args) => ({
    components: { InputOtpField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtpField v-bind="args" />
      </div>
    `,
  }),
}
