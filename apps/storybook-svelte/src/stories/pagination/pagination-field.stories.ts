import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import PaginationFieldPreview from "./PaginationFieldPreview.svelte"

const meta = {
  title: "Pagination/Molecule/PaginationField",
  component: PaginationFieldPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    pageCount: { control: "number" },
    siblingCount: { control: "number" },
    initialPage: { control: "number" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof PaginationFieldPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "Search results",
    description: "Page through your filtered results.",
    pageCount: 10,
    siblingCount: 2,
    initialPage: 1,
  },
}

export const WithoutDescription: Story = {
  args: {
    label: "Search results",
    description: undefined,
    pageCount: 10,
    siblingCount: 2,
  },
}

export const Invalid: Story = {
  args: {
    label: "Search results",
    description: undefined,
    error: "No results found for the current filters.",
    pageCount: 10,
    siblingCount: 2,
  },
}

export const Disabled: Story = {
  args: {
    label: "Search results",
    description: "Page through your filtered results.",
    pageCount: 10,
    siblingCount: 2,
    disabled: true,
  },
}
