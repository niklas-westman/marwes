import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { PaginationItemAriaLabelOptions } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import PaginationNarrowContainer from "./PaginationNarrowContainer.svelte"
import PaginationPreview from "./PaginationPreview.svelte"
import PaginationShowcase from "./PaginationShowcase.svelte"

const meta = {
  title: "Pagination/Atom",
  component: PaginationPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    pageCount: { control: "number" },
    page: { control: "number" },
    siblingCount: { control: "number" },
    boundaryCount: { control: "number" },
    maxVisibleItems: { control: "number" },
    controlDisplay: { control: "select", options: ["auto", "label", "icon"] },
    adaptive: { control: "boolean" },
    showPrevNext: { control: "boolean" },
    showFirstLast: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof PaginationPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    page: 1,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const WithoutPrevNext: Story = {
  args: {
    page: 1,
    pageCount: 10,
    showPrevNext: false,
  },
}

export const CompactRange: Story = {
  args: {
    page: 5,
    pageCount: 10,
    siblingCount: 1,
  },
}

export const FirstLastControls: Story = {
  args: {
    page: 5,
    pageCount: 10,
    showFirstLast: true,
  },
}

export const CustomAriaLabels: Story = {
  args: {
    page: 4,
    pageCount: 10,
    showFirstLast: true,
    getItemAriaLabel: (item: PaginationItemAriaLabelOptions) =>
      item.type === "page" ? `Open result page ${item.page}` : `Open ${item.type} control`,
  },
}

export const NarrowContainer: Story = {
  render: () => ({
    Component: PaginationNarrowContainer,
  }),
}

export const IconControls: Story = {
  args: {
    page: 5,
    pageCount: 10,
    controlDisplay: "icon",
  },
}

export const FirstPage: Story = {
  args: {
    page: 1,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const LastPage: Story = {
  args: {
    page: 10,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const Disabled: Story = {
  args: {
    page: 3,
    pageCount: 10,
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => ({
    Component: PaginationShowcase,
  }),
}
