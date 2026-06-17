import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
// Atom is no longer publicly exported; deep-import for story documentation.
import {
  Pagination,
  type PaginationProps,
} from "../../../../../packages/react/src/components/pagination/pagination"

const meta: Meta<typeof Pagination> = {
  title: "Pagination/Atom",
  component: Pagination,
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
}

export default meta

type Story = StoryObj<typeof Pagination>

function ControlledExample(props: Partial<PaginationProps>) {
  const [page, setPage] = React.useState(props.page ?? 1)

  return (
    <Pagination pageCount={10} siblingCount={2} {...props} page={page} onPageChange={setPage} />
  )
}

export const Default: Story = {
  render: () => <ControlledExample />,
}

export const WithoutPrevNext: Story = {
  render: () => <ControlledExample showPrevNext={false} />,
}

export const CompactRange: Story = {
  render: () => <ControlledExample page={5} siblingCount={1} />,
}

export const FirstLastControls: Story = {
  render: () => <ControlledExample page={5} showFirstLast />,
}

export const CustomAriaLabels: Story = {
  render: () => (
    <ControlledExample
      page={4}
      showFirstLast
      getItemAriaLabel={(item) =>
        item.type === "page" ? `Open result page ${item.page}` : `Open ${item.type} control`
      }
    />
  ),
}

export const NarrowContainer: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <ControlledExample page={6} pageCount={100} siblingCount={2} showFirstLast />
    </div>
  ),
}

export const IconControls: Story = {
  render: () => <ControlledExample page={5} controlDisplay="icon" />,
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
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Pagination page={1} pageCount={10} siblingCount={2} ariaLabel="First page pagination" />
      <Pagination page={5} pageCount={10} siblingCount={1} ariaLabel="Middle page pagination" />
      <Pagination page={10} pageCount={10} siblingCount={2} ariaLabel="Last page pagination" />
      <Pagination page={5} pageCount={10} showFirstLast ariaLabel="First last pagination" />
      <Pagination page={5} pageCount={10} controlDisplay="icon" ariaLabel="Icon pagination" />
      <Pagination page={3} pageCount={10} showPrevNext={false} ariaLabel="Compact pagination" />
      <Pagination page={3} pageCount={10} disabled ariaLabel="Disabled pagination" />
    </div>
  ),
}
