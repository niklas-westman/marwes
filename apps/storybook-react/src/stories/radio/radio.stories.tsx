import { storybookLayout, storybookRadioArgTypes } from "@marwes-ui/core"
import { Radio } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Radio> = {
  title: "Radio/Atom",
  component: Radio,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookRadioArgTypes,
}

export default meta

type Story = StoryObj<typeof Radio>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return <Radio ariaLabel="Option A" name="demo" checked={checked} onCheckedChange={setChecked} />
  },
}

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true)
    return <Radio ariaLabel="Option A" name="demo" checked={checked} onCheckedChange={setChecked} />
  },
}

export const Disabled: Story = {
  args: { ariaLabel: "Option A", name: "demo", disabled: true },
}

export const Invalid: Story = {
  args: { ariaLabel: "Option A", name: "demo", invalid: true },
}

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("a")
    const options = [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
      { value: "c", label: "Option C" },
    ]

    return (
      <div
        role="radiogroup"
        aria-label="Preference"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {options.map(({ value, label }) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: Radio renders a native input
          <label
            key={value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <Radio
              name="preference"
              value={value}
              checked={selected === value}
              onCheckedChange={(checked) => {
                if (checked) setSelected(value)
              }}
            />
            {label}
          </label>
        ))}
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { label: "Unchecked", props: {} },
        { label: "Checked", props: { checked: true, onChange: () => {} } },
        { label: "Disabled", props: { disabled: true } },
        {
          label: "Disabled + checked",
          props: { disabled: true, checked: true, onChange: () => {} },
        },
        { label: "Invalid", props: { invalid: true } },
      ].map(({ label, props }) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: Radio renders a native input
        <label
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#4b5563" }}
        >
          <Radio name="states" ariaLabel={label} {...props} />
          {label}
        </label>
      ))}
    </div>
  ),
}
