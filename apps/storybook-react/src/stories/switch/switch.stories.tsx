import { SwitchSize, storybookLayout } from "@marwes-ui/core"
import { Switch } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ToggleableSwitchStory } from "./story-helpers"

const meta: Meta<typeof Switch> = {
  title: "Switch/Atom",
  component: Switch,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    size: {
      control: { type: "inline-radio" },
      options: Object.values(SwitchSize),
    },
  },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: { children: "Enable notifications" },
  render: (args) => <ToggleableSwitchStory {...args} />,
}

export const Checked: Story = {
  args: { children: "Enable notifications", checked: true },
  render: (args) => <ToggleableSwitchStory {...args} />,
}

export const Disabled: Story = {
  args: { children: "Disabled setting", disabled: true },
}

export const CheckedDisabled: Story = {
  args: { children: "Active but locked", checked: true, disabled: true },
}

export const SizeComparison: Story = {
  render: () => {
    const [compact, setCompact] = React.useState(false)
    const [wide, setWide] = React.useState(true)
    const [rich, setRich] = React.useState(false)

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Switch size={SwitchSize.compact} checked={compact} onCheckedChange={setCompact}>
          Compact 24x16
        </Switch>
        <Switch size={SwitchSize.wide} checked={wide} onCheckedChange={setWide}>
          Wide 30x16
        </Switch>
        <Switch size={SwitchSize.rich} checked={rich} onCheckedChange={setRich}>
          Rich 30x20
        </Switch>
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => {
    const [startsOff, setStartsOff] = React.useState(false)
    const [startsOn, setStartsOn] = React.useState(true)
    const [interactive, setInteractive] = React.useState(false)

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Starts off</p>
          <Switch checked={startsOff} onCheckedChange={setStartsOff}>
            Enable notifications
          </Switch>
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Starts on</p>
          <Switch checked={startsOn} onCheckedChange={setStartsOn}>
            Enable notifications
          </Switch>
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Disabled off</p>
          <Switch disabled>Disabled setting</Switch>
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Disabled on</p>
          <Switch checked disabled>
            Locked setting
          </Switch>
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Interactive</p>
          <Switch checked={interactive} onCheckedChange={setInteractive}>
            {interactive ? "On" : "Off"}
          </Switch>
        </div>
      </div>
    )
  },
}
