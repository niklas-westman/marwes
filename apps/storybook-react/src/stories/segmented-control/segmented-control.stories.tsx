import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Icon, IconName, SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem, SegmentedControlProps } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof SegmentedControl> = {
  title: "Segmented Control/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "inverse", "pill"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof SegmentedControl>

const twoSegmentItems: SegmentedControlItem[] = [
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
]

const threeSegmentItems: SegmentedControlItem[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

const iconItems: SegmentedControlItem[] = [
  {
    value: "light",
    icon: <Icon name={IconName.Sun} decorative size={14} />,
    ariaLabel: "Light mode",
  },
  {
    value: "dark",
    icon: <Icon name={IconName.Moon} decorative size={14} />,
    ariaLabel: "Dark mode",
  },
]

const iconLabelItems: SegmentedControlItem[] = [
  { value: "star", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Favorites" },
  {
    value: "settings",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    label: "Settings",
  },
  { value: "search", icon: <Icon name={IconName.Search} decorative size={12} />, label: "Search" },
]

function ControlledExample(props: Partial<SegmentedControlProps>) {
  const [value, setValue] = React.useState(props.value ?? "compact")
  return (
    <SegmentedControl
      items={twoSegmentItems}
      ariaLabel="View density"
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}

export const Default: Story = {
  args: {
    items: twoSegmentItems,
    defaultValue: "compact",
    ariaLabel: "View density",
  },
}

export const ThreeSegments: Story = {
  args: {
    items: threeSegmentItems,
    defaultValue: "react",
    ariaLabel: "Framework",
  },
}

export const IconOnly: Story = {
  args: {
    items: iconItems,
    defaultValue: "light",
    variant: "pill",
    ariaLabel: "Theme mode",
  },
}

export const IconWithLabel: Story = {
  args: {
    items: iconLabelItems,
    defaultValue: "star",
    ariaLabel: "Navigation",
  },
}

export const Inverse: Story = {
  args: {
    items: twoSegmentItems,
    defaultValue: "compact",
    variant: "inverse",
    ariaLabel: "View density",
  },
}

export const Pill: Story = {
  args: {
    items: iconItems,
    defaultValue: "light",
    variant: "pill",
    ariaLabel: "Theme mode",
  },
}

export const Small: Story = {
  args: {
    items: twoSegmentItems,
    defaultValue: "compact",
    size: "sm",
    ariaLabel: "View density",
  },
}

export const Disabled: Story = {
  args: {
    items: twoSegmentItems,
    defaultValue: "compact",
    disabled: true,
    ariaLabel: "View density",
  },
}

export const DisabledItem: Story = {
  args: {
    items: [
      { value: "a", label: "Enabled" },
      { value: "b", label: "Disabled", disabled: true },
      { value: "c", label: "Enabled" },
    ],
    defaultValue: "a",
    ariaLabel: "Options",
  },
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Default</p>
        <SegmentedControl items={threeSegmentItems} defaultValue="react" ariaLabel="Framework" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Inverse</p>
        <SegmentedControl
          items={threeSegmentItems}
          defaultValue="react"
          variant="inverse"
          ariaLabel="Framework"
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Pill (icon only)</p>
        <SegmentedControl items={iconItems} defaultValue="light" variant="pill" ariaLabel="Theme" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Small</p>
        <SegmentedControl
          items={twoSegmentItems}
          defaultValue="compact"
          size="sm"
          ariaLabel="Density"
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Disabled</p>
        <SegmentedControl
          items={twoSegmentItems}
          defaultValue="compact"
          disabled
          ariaLabel="Density"
        />
      </div>
    </div>
  ),
}
