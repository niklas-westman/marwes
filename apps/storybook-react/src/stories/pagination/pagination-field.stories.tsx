import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PaginationField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof PaginationField> = {
  title: "Pagination/Molecule/PaginationField",
  component: PaginationField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof PaginationField>

function ControlledExample(props: Partial<React.ComponentProps<typeof PaginationField>>) {
  const [page, setPage] = React.useState(1)
  return (
    <div style={{ width: "480px" }}>
      <PaginationField
        label="Search results"
        description="Page through your filtered results."
        {...props}
        pagination={{
          pageCount: 10,
          siblingCount: 2,
          ...props.pagination,
          page,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}

export const Basic: Story = {
  render: () => <ControlledExample />,
}

export const WithoutDescription: Story = {
  render: () => <ControlledExample description={undefined} />,
}

export const Invalid: Story = {
  render: () => (
    <ControlledExample description={undefined} error="No results found for the current filters." />
  ),
}

export const Disabled: Story = {
  render: () => (
    <ControlledExample pagination={{ pageCount: 10, siblingCount: 2, disabled: true }} />
  ),
}
