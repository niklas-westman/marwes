import { SearchField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Fields/Purpose/SearchField",
  component: SearchField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const SearchExample: Story = {
  args: {
    label: "Search",
    input: {
      placeholder: "Search...",
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      const search = ref("")
      return { args, search }
    },
    template: `
      <div style="width: 320px;">
        <SearchField v-bind="args" v-model="search" />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current search: {{ search || "(empty)" }}
        </p>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  args: {
    label: "Search products",
    helperText: "Type to filter products, click X to clear",
    input: {
      placeholder: "Enter product name...",
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      const search = ref("")
      return { args, search }
    },
    template: `
      <div style="width: 320px;">
        <SearchField v-bind="args" v-model="search" />
      </div>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: "Search",
    input: {
      placeholder: "Search...",
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      const search = ref("a")
      return { args, search }
    },
    template: `
      <div style="width: 320px;">
        <SearchField
          v-bind="args"
          v-model="search"
          :error="search.length > 0 && search.length < 3 ? 'Minimum 3 characters required' : ''"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Search",
    helperText: "Search is temporarily disabled",
    input: {
      disabled: true,
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      const search = ref("Disabled search")
      return { args, search }
    },
    template: `
      <div style="width: 320px;">
        <SearchField v-bind="args" v-model="search" />
      </div>
    `,
  }),
}

export const ReadOnly: Story = {
  args: {
    label: "Current filter",
    input: {
      readOnly: true,
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      const search = ref("electronics")
      return { args, search }
    },
    template: `
      <div style="width: 320px;">
        <SearchField v-bind="args" v-model="search" />
      </div>
    `,
  }),
}
