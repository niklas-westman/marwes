import { storybookA11yPolicy } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
// Atom is no longer the public field — `InputOtpField` is. We deep-import the
// bare atom here for documentation of the cells-only render.
import {
  InputOtp,
  type InputOtpProps,
} from "../../../../../packages/vue/src/components/input/input-otp"

const meta = {
  title: "Input/Molecule/InputOtp",
  component: InputOtp as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    length: 6,
    ariaLabel: "Verification code",
  },
} satisfies Meta<InputOtpProps>

export default meta

type Story = StoryObj<InputOtpProps>

export const Basic: Story = {
  render: (args) => ({
    components: { InputOtp, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputOtp v-bind="args" />
        <Paragraph style="margin-top: 16px; font-size: 12px; color: #666;">
          Bare atom — no label / helper / error. Use InputOtpField for labeled forms.
        </Paragraph>
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
    invalid: true,
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
