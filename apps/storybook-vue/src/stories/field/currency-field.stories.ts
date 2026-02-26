import type { CurrencyFieldProps } from "@marwes-ui/vue"
import { CurrencyField, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/CurrencyField",
  component: CurrencyField as unknown as object,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<CurrencyFieldProps>

export default meta
type Story = StoryObj<CurrencyFieldProps>

export const CurrencyExample: Story = {
  args: {
    label: "Amount",
    currency: "USD",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => ({
    components: { CurrencyField, Paragraph },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current amount: {{ amount || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}

export const EuroCurrency: Story = {
  args: {
    label: "Price",
    currency: "EUR",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const PoundCurrency: Story = {
  args: {
    label: "Cost",
    currency: "GBP",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const WithCustomHelperText: Story = {
  args: {
    label: "Donation amount",
    currency: "USD",
    helperText: "Enter the amount you'd like to donate",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Amount",
    currency: "USD",
    error: "Please enter a valid number",
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("abc")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const NoCurrency: Story = {
  args: {
    label: "Amount",
    helperText: "Enter a numeric value",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Amount *",
    currency: "USD",
    input: {
      required: true,
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Total amount",
    currency: "USD",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { CurrencyField },
    setup() {
      const amount = ref("99.99")
      return { args, amount }
    },
    template: `
      <div style="width: 320px;">
        <CurrencyField v-bind="args" v-model="amount" />
      </div>
    `,
  }),
}
