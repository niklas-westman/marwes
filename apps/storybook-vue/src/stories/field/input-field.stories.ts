import type { InputFieldProps } from "@marwes-ui/vue"
import { InputField, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/General/InputField",
  component: InputField as unknown as object,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Label",
  },
} satisfies Meta<InputFieldProps>

export default meta
type Story = StoryObj<InputFieldProps>

export const Basic: Story = {
  args: {
    label: "Label",
    input: {
      placeholder: "Enter text...",
    },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Label",
    helperText: "Additional information to help the user.",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => ({
    components: { InputField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Label",
    error: "This field is required.",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => ({
    components: { InputField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Label",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { InputField },
    setup() {
      const value = ref("Disabled value")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const ReadOnly: Story = {
  args: {
    label: "Label",
    input: {
      readOnly: true,
    },
  },
  render: (args) => ({
    components: { InputField },
    setup() {
      const value = ref("Read-only value")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: "Label *",
    helperText: "This field is required",
    input: {
      required: true,
      placeholder: "Enter text...",
    },
  },
  render: (args) => ({
    components: { InputField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  args: {
    label: "Label",
    helperText: "Type something to see the controlled value",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => ({
    components: { InputField, Paragraph },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <InputField v-bind="args" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}
