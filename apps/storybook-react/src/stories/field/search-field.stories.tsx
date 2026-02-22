import { SearchField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof SearchField> = {
  title: "Fields/Purpose/SearchField",
  component: SearchField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SearchField>

/**
 * Basic search field with controlled state.
 * Type to see the clear button (X icon) appear automatically.
 */
export const SearchExample: Story = {
  args: {
    label: "Search",
    input: {
      placeholder: "Search...",
    },
  },
  render: (args) => {
    const [search, setSearch] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <SearchField
          input={{
            value: search,
            onValueChange: setSearch,
          }}
          {...args}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current search: {search || "(empty)"}
        </p>
      </div>
    )
  },
}

/**
 * Search field with helper text to guide the user.
 */
export const WithHelperText: Story = {
  args: {
    label: "Search products",
    helperText: "Type to filter products, click X to clear",
    input: {
      placeholder: "Enter product name...",
    },
  },
  render: (args) => {
    const [search, setSearch] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <SearchField
          input={{
            value: search,
            onValueChange: setSearch,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Search field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Search",
    input: {
      placeholder: "Search...",
    },
  },
  render: (args) => {
    const [search, setSearch] = useState("a")

    return (
      <div style={{ width: "320px" }}>
        <SearchField
          error={search.length > 0 && search.length < 3 ? "Minimum 3 characters required" : ""}
          input={{
            value: search,
            onValueChange: setSearch,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Disabled search field.
 */
export const Disabled: Story = {
  args: {
    label: "Search",
    helperText: "Search is temporarily disabled",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [search, setSearch] = useState("Disabled search")

    return (
      <div style={{ width: "320px" }}>
        <SearchField
          input={{
            value: search,
            onValueChange: setSearch,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Read-only search field.
 */
export const ReadOnly: Story = {
  args: {
    label: "Current filter",
    input: {
      readOnly: true,
    },
  },
  render: (args) => {
    const [search, setSearch] = useState("electronics")

    return (
      <div style={{ width: "320px" }}>
        <SearchField
          input={{
            value: search,
            onValueChange: setSearch,
          }}
          {...args}
        />
      </div>
    )
  },
}
