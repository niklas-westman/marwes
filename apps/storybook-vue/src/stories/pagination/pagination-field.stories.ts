import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PaginationField } from "@marwes-ui/vue"
import type { PaginationFieldProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Pagination/Molecule/PaginationField",
  component: PaginationField as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  args: {
    label: "Search results",
    description: "Page through your filtered results.",
    pagination: { pageCount: 10, siblingCount: 2 },
  },
} satisfies Meta<PaginationFieldProps>

export default meta

type Story = StoryObj<PaginationFieldProps>

export const Basic: Story = {
  render: (args) => ({
    components: { PaginationField },
    setup() {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <div style="width: 480px;">
        <PaginationField
          :label="args.label"
          :description="args.description"
          :pagination="{ ...(args.pagination ?? {}), modelValue: page, 'onUpdate:modelValue': (v) => page = v }"
        />
      </div>
    `,
  }),
}

export const WithoutDescription: Story = {
  args: {
    label: "Search results",
    pagination: { pageCount: 10, siblingCount: 2 },
  },
  render: (args) => ({
    components: { PaginationField },
    setup() {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <div style="width: 480px;">
        <PaginationField
          :label="args.label"
          :pagination="{ ...(args.pagination ?? {}), modelValue: page, 'onUpdate:modelValue': (v) => page = v }"
        />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: {
    label: "Search results",
    error: "No results found for the current filters.",
    pagination: { pageCount: 10, siblingCount: 2 },
  },
  render: (args) => ({
    components: { PaginationField },
    setup() {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <div style="width: 480px;">
        <PaginationField
          :label="args.label"
          :error="args.error"
          :pagination="{ ...(args.pagination ?? {}), modelValue: page, 'onUpdate:modelValue': (v) => page = v }"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: "Search results",
    description: "Page through your filtered results.",
    pagination: { pageCount: 10, siblingCount: 2, disabled: true },
  },
  render: (args) => ({
    components: { PaginationField },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 480px;">
        <PaginationField v-bind="args" />
      </div>
    `,
  }),
}
