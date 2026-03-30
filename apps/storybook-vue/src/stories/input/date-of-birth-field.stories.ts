import { DateOfBirthField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Purpose/DateOfBirthField",
  component: DateOfBirthField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateOfBirthField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "Date of birth",
    helperText: "Used for age checks and account verification.",
  },
  render: (args) => ({
    components: { DateOfBirthField },
    setup() {
      const birthDate = ref("")
      return { args, birthDate }
    },
    template: `
      <div style="width: 320px;">
        <DateOfBirthField v-bind="args" v-model="birthDate" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ birthDate || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Date of birth",
    helperText: "Future dates are rejected.",
  },
  render: (args) => ({
    components: { DateOfBirthField },
    setup() {
      const birthDate = ref("2035-01-01")
      return { args, birthDate }
    },
    template: `
      <div style="width: 320px;">
        <DateOfBirthField
          v-bind="args"
          v-model="birthDate"
          :error="birthDate.length > 0 && birthDate > '2026-03-30' ? 'Date of birth cannot be in the future' : ''"
        />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Date of birth *",
    helperText: "Required for profile completion.",
    input: {
      required: true,
    },
  },
  render: (args) => ({
    components: { DateOfBirthField },
    setup() {
      const birthDate = ref("")
      return { args, birthDate }
    },
    template: `
      <div style="width: 320px;">
        <DateOfBirthField v-bind="args" v-model="birthDate" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Date of birth",
    helperText: "This value is locked after verification.",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { DateOfBirthField },
    setup() {
      const birthDate = ref("1995-04-18")
      return { args, birthDate }
    },
    template: `
      <div style="width: 320px;">
        <DateOfBirthField v-bind="args" v-model="birthDate" />
      </div>
    `,
  }),
}
