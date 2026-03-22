import { storybookLayout } from "@marwes-ui/core"
import { Switch } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Switch> = {
  title: "Switch/Atom",
  component: Switch,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: { children: "Enable notifications" },
}

export const Checked: Story = {
  args: { children: "Enable notifications", checked: true },
}

export const Disabled: Story = {
  args: { children: "Disabled setting", disabled: true },
}

export const CheckedDisabled: Story = {
  args: { children: "Active but locked", checked: true, disabled: true },
}

export const AllStates: Story = {
  render: () => {
    const [on, setOn] = React.useState(false)

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Off</p>
          <Switch>Enable notifications</Switch>
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>On</p>
          <Switch checked>Enable notifications</Switch>
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
          <Switch checked={on} onClick={() => setOn((v) => !v)}>
            {on ? "On" : "Off"}
          </Switch>
        </div>
      </div>
    )
  },
}
