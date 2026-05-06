import { storybookA11yPolicy } from "@marwes-ui/core"
import type { RichTextFieldProps } from "@marwes-ui/vue"
import { Paragraph, RichTextField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Input/Molecule/RichTextField",
  component: RichTextField as unknown as object,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
    docs: {
      description: {
        component:
          "Field-wrapped rich text editor. This inherits the same manual-review-heavy boundary as RichText: automated tests protect the wrapper contract, but editor accessibility should still be validated in supported browser and assistive technology combinations.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Description",
    editor: {
      placeholder: "Write a formatted description...",
    },
  },
} satisfies Meta<RichTextFieldProps>

export default meta

type Story = StoryObj<RichTextFieldProps>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Use bold, italic, and underline to highlight the most important details.",
  },
  render: (args) => ({
    components: { RichTextField },
    setup() {
      const value = ref("")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichTextField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    error: "Description is required.",
  },
  render: (args) => ({
    components: { RichTextField },
    setup() {
      const value = ref("<p><strong>Missing context</strong></p>")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichTextField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    editor: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { RichTextField },
    setup() {
      const value = ref("<p><strong>Locked</strong> content</p>")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichTextField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const ReadOnly: Story = {
  args: {
    editor: {
      readOnly: true,
    },
  },
  render: (args) => ({
    components: { RichTextField },
    setup() {
      const value = ref("<p><em>Read-only</em> summary with <u>underline</u></p>")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichTextField v-bind="args" v-model="value" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  args: {
    helperText: "Format text and inspect the emitted HTML below.",
  },
  render: (args) => ({
    components: { RichTextField, Paragraph },
    setup() {
      const value = ref("<p>Start typing...</p>")
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <RichTextField v-bind="args" v-model="value" />
        <Paragraph style="margin-top: 16px; font-size: 14px; color: #666;">
          Current HTML: {{ value || "(empty)" }}
        </Paragraph>
      </div>
    `,
  }),
}
