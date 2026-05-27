import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { PaginationItemAriaLabelOptions } from "@marwes-ui/core"
import { Pagination } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { defineComponent, h, ref } from "vue"

const meta = {
  title: "Pagination/Atom",
  component: Pagination as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    pageCount: { control: "number" },
    modelValue: { control: "number" },
    siblingCount: { control: "number" },
    boundaryCount: { control: "number" },
    maxVisibleItems: { control: "number" },
    controlDisplay: { control: "select", options: ["auto", "label", "icon"] },
    adaptive: { control: "boolean" },
    showPrevNext: { control: "boolean" },
    showFirstLast: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function controlledPagination(initialPage = 1, props: Record<string, unknown> = {}) {
  return defineComponent({
    name: "ControlledPagination",
    components: { Pagination },
    setup() {
      const page = ref(initialPage)
      return () =>
        h(Pagination, {
          pageCount: 10,
          siblingCount: 2,
          ...props,
          modelValue: page.value,
          "onUpdate:modelValue": (value: number) => {
            page.value = value
          },
        })
    },
  })
}

export const Default: Story = {
  render: () => ({
    components: { Component: controlledPagination() },
    setup: () => () => h(controlledPagination()),
  }),
}

export const WithoutPrevNext: Story = {
  render: () => ({
    setup: () => () => h(controlledPagination(1, { showPrevNext: false })),
  }),
}

export const CompactRange: Story = {
  render: () => ({
    setup: () => () => h(controlledPagination(5, { siblingCount: 1 })),
  }),
}

export const FirstLastControls: Story = {
  render: () => ({
    setup: () => () => h(controlledPagination(5, { showFirstLast: true })),
  }),
}

export const CustomAriaLabels: Story = {
  render: () => ({
    setup: () => () =>
      h(
        controlledPagination(4, {
          showFirstLast: true,
          getItemAriaLabel: (item: PaginationItemAriaLabelOptions) =>
            item.type === "page" ? `Open result page ${item.page}` : `Open ${item.type} control`,
        }),
      ),
  }),
}

export const NarrowContainer: Story = {
  render: () => ({
    setup: () => () =>
      h("div", { style: "width:240px" }, [
        h(controlledPagination(6, { pageCount: 100, siblingCount: 2, showFirstLast: true })),
      ]),
  }),
}

export const IconControls: Story = {
  render: () => ({
    setup: () => () => h(controlledPagination(5, { controlDisplay: "icon" })),
  }),
}

export const FirstPage: Story = {
  args: {
    modelValue: 1,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const LastPage: Story = {
  args: {
    modelValue: 10,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const Disabled: Story = {
  args: {
    modelValue: 3,
    pageCount: 10,
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => ({
    setup() {
      return () =>
        h("div", { style: "display:flex;flex-direction:column;gap:24px" }, [
          h(Pagination, {
            modelValue: 1,
            pageCount: 10,
            siblingCount: 2,
            ariaLabel: "First page pagination",
          }),
          h(Pagination, {
            modelValue: 5,
            pageCount: 10,
            siblingCount: 1,
            ariaLabel: "Middle page pagination",
          }),
          h(Pagination, {
            modelValue: 10,
            pageCount: 10,
            siblingCount: 2,
            ariaLabel: "Last page pagination",
          }),
          h(Pagination, {
            modelValue: 5,
            pageCount: 10,
            showFirstLast: true,
            ariaLabel: "First last pagination",
          }),
          h(Pagination, {
            modelValue: 5,
            pageCount: 10,
            controlDisplay: "icon",
            ariaLabel: "Icon pagination",
          }),
          h(Pagination, {
            modelValue: 3,
            pageCount: 10,
            showPrevNext: false,
            ariaLabel: "Compact pagination",
          }),
          h(Pagination, {
            modelValue: 3,
            pageCount: 10,
            disabled: true,
            ariaLabel: "Disabled pagination",
          }),
        ])
    },
  }),
}
