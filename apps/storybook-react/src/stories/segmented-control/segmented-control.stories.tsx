import { IconName, SegmentedControlVariant, storybookLayout } from "@marwes-ui/core"
import { Icon, SegmentedControl } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const viewOptions = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "cards", label: "Cards" },
]

const iconOptions = [
  { value: "light", label: "Light", icon: <Icon name={IconName.Sun} decorative /> },
  { value: "dark", label: "Dark", icon: <Icon name={IconName.Moon} decorative /> },
  { value: "system", label: "System", icon: <Icon name={IconName.Star} decorative /> },
]

const meta: Meta<typeof SegmentedControl> = {
  title: "SegmentedControl/Atom",
  component: SegmentedControl,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    ariaLabel: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    variant: {
      control: { type: "inline-radio" },
      options: Object.values(SegmentedControlVariant),
    },
  },
}

export default meta

type Story = StoryObj<typeof SegmentedControl>

export const Default: Story = {
  args: {
    ariaLabel: "View mode",
    options: viewOptions,
    defaultValue: "list",
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.defaultValue ?? "list")

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

export const WithVisibleLabel: Story = {
  args: {
    label: "View mode",
    options: viewOptions,
    defaultValue: "grid",
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.defaultValue ?? "grid")

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

export const WithIcons: Story = {
  args: {
    ariaLabel: "Theme mode",
    options: iconOptions,
    defaultValue: "light",
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.defaultValue ?? "light")

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

export const ContrastVariant: Story = {
  args: {
    ariaLabel: "Theme mode",
    variant: SegmentedControlVariant.contrast,
    options: iconOptions,
    defaultValue: "dark",
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.defaultValue ?? "dark")

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

export const DisabledOption: Story = {
  args: {
    ariaLabel: "View mode",
    options: [
      { value: "list", label: "List" },
      { value: "grid", label: "Grid", disabled: true },
      { value: "cards", label: "Cards" },
    ],
    defaultValue: "list",
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.defaultValue ?? "list")

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

export const AllStates: Story = {
  render: () => {
    const [viewMode, setViewMode] = React.useState("list")
    const [themeMode, setThemeMode] = React.useState("system")

    return (
      <div style={{ display: "grid", gap: 24 }}>
        <SegmentedControl
          label="Standard"
          options={viewOptions}
          value={viewMode}
          onValueChange={setViewMode}
        />
        <SegmentedControl
          label="Surface variant"
          options={iconOptions}
          value={themeMode}
          onValueChange={setThemeMode}
        />
        <SegmentedControl
          label="Contrast variant"
          variant={SegmentedControlVariant.contrast}
          options={iconOptions}
          value={themeMode}
          onValueChange={setThemeMode}
        />
        <SegmentedControl label="Disabled group" disabled options={viewOptions} value="grid" />
      </div>
    )
  },
}
