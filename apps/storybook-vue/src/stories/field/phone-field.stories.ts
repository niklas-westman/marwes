import { PhoneField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/PhoneField",
  component: PhoneField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneField>

export default meta
type Story = StoryObj<typeof meta>

export const PhoneExample: Story = {
  args: {
    label: "Phone number",
    input: {
      placeholder: "+1 (555) 000-0000",
    },
  },
  render: (args) => ({
    components: { PhoneField },
    setup() {
      const phone = ref("")
      return { args, phone }
    },
    template: `
      <div style="width: 320px;">
        <PhoneField v-bind="args" v-model="phone" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current phone: {{ phone || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  args: {
    label: "Phone number",
    helperText: "Include country code for international numbers",
    input: {
      placeholder: "+1 (555) 000-0000",
    },
  },
  render: (args) => ({
    components: { PhoneField },
    setup() {
      const phone = ref("")
      return { args, phone }
    },
    template: `
      <div style="width: 320px;">
        <PhoneField v-bind="args" v-model="phone" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Phone number",
    error: "Please enter a valid phone number",
  },
  render: (args) => ({
    components: { PhoneField },
    setup() {
      const phone = ref("555")
      return { args, phone }
    },
    template: `
      <div style="width: 320px;">
        <PhoneField v-bind="args" v-model="phone" />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Phone number *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => ({
    components: { PhoneField },
    setup() {
      const phone = ref("")
      return { args, phone }
    },
    template: `
      <div style="width: 320px;">
        <PhoneField v-bind="args" v-model="phone" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Phone number",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { PhoneField },
    setup() {
      const phone = ref("+1 (555) 123-4567")
      return { args, phone }
    },
    template: `
      <div style="width: 320px;">
        <PhoneField v-bind="args" v-model="phone" />
      </div>
    `,
  }),
}
