import { storybookA11yPolicy } from "@marwes-ui/core"
import { ZipCodeField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Purpose/ZipCodeField",
  component: ZipCodeField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ZipCodeField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "ZIP code",
    helperText: "Used for shipping estimates and tax lookup.",
    input: {
      placeholder: "02108",
    },
  },
  render: (args) => ({
    components: { ZipCodeField },
    setup() {
      const zipCode = ref("")
      return { args, zipCode }
    },
    template: `
      <div style="width: 320px;">
        <ZipCodeField v-bind="args" v-model="zipCode" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current ZIP code: {{ zipCode || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "ZIP code",
    helperText: "Enter a 5-digit ZIP code for US shipping.",
  },
  render: (args) => ({
    components: { ZipCodeField },
    setup() {
      const zipCode = ref("12")
      return { args, zipCode }
    },
    template: `
      <div style="width: 320px;">
        <ZipCodeField
          v-bind="args"
          v-model="zipCode"
          :error="zipCode.length > 0 && zipCode.length < 5 ? 'Enter a valid ZIP code' : ''"
          :input="{ placeholder: '02108' }"
        />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "ZIP code *",
    helperText: "Required for delivery availability.",
    input: {
      required: true,
      placeholder: "02108",
    },
  },
  render: (args) => ({
    components: { ZipCodeField },
    setup() {
      const zipCode = ref("")
      return { args, zipCode }
    },
    template: `
      <div style="width: 320px;">
        <ZipCodeField v-bind="args" v-model="zipCode" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "ZIP code",
    helperText: "Locked to the verified billing address.",
    input: {
      disabled: true,
      placeholder: "02108",
    },
  },
  render: (args) => ({
    components: { ZipCodeField },
    setup() {
      const zipCode = ref("02108")
      return { args, zipCode }
    },
    template: `
      <div style="width: 320px;">
        <ZipCodeField v-bind="args" v-model="zipCode" />
      </div>
    `,
  }),
}
