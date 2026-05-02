import { storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import { Checkbox, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox/Atom",
  component: Checkbox,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  args: {
    size: "md",
  },
  argTypes: storybookCheckboxArgTypes,
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Playground: Story = {
  args: {
    ariaLabel: "Accept terms",
  },
}

export const UncontrolledDefaultChecked: Story = {
  render: () => <Checkbox ariaLabel="Uncontrolled" defaultChecked />,
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox ariaLabel="Controlled" checked={checked} onCheckedChange={setChecked} />
        <Paragraph size="sm">checked: {String(checked)}</Paragraph>
      </div>
    )
  },
}

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    const [indeterminate, setIndeterminate] = React.useState(true)

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox
          ariaLabel="Indeterminate"
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(next) => {
            // Typical UX: first click clears indeterminate and sets checked=true
            setIndeterminate(false)
            setChecked(next)
          }}
        />
        <Paragraph size="sm">
          checked: {String(checked)}, indeterminate: {String(indeterminate)}
        </Paragraph>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox ariaLabel="Disabled unchecked" disabled />
      <Checkbox ariaLabel="Disabled checked" disabled checked />
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox ariaLabel="Invalid unchecked" invalid />
      <Checkbox ariaLabel="Invalid checked" invalid checked />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Checkbox ariaLabel="Small" size="sm" />
        <Paragraph size="sm">sm (1rem)</Paragraph>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Checkbox ariaLabel="Medium" size="md" />
        <Paragraph size="sm">md (1.125rem)</Paragraph>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Checkbox ariaLabel="Large" size="lg" />
        <Paragraph size="sm">lg (1.375rem)</Paragraph>
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <Paragraph size="sm" style={{ marginBottom: 8, fontWeight: 600 }}>
          Default States
        </Paragraph>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Checkbox ariaLabel="Unchecked" />
          <Checkbox ariaLabel="Checked" checked />
          <Checkbox ariaLabel="Indeterminate" indeterminate />
        </div>
      </div>

      <div>
        <Paragraph size="sm" style={{ marginBottom: 8, fontWeight: 600 }}>
          Disabled States
        </Paragraph>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Checkbox ariaLabel="Disabled unchecked" disabled />
          <Checkbox ariaLabel="Disabled checked" disabled checked />
          <Checkbox ariaLabel="Disabled indeterminate" disabled indeterminate />
        </div>
      </div>

      <div>
        <Paragraph size="sm" style={{ marginBottom: 8, fontWeight: 600 }}>
          Error States
        </Paragraph>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Checkbox ariaLabel="Error unchecked" invalid />
          <Checkbox ariaLabel="Error checked" invalid checked />
        </div>
      </div>
    </div>
  ),
}
