import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Breadcrumb } from "@marwes-ui/react"
import type { BreadcrumbItem } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const items: BreadcrumbItem[] = [
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
]

const meta: Meta<typeof Breadcrumb> = {
  title: "Breadcrumb/Atom",
  component: Breadcrumb,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    showHome: { control: "boolean" },
    homeHref: { control: "text" },
    ariaLabel: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: {
    homeHref: "#",
    items,
  },
}

export const WithoutHome: Story = {
  args: {
    showHome: false,
    items,
  },
}

export const ButtonBacked: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("Components")
    return (
      <Breadcrumb
        showHome={false}
        items={[
          { value: "Components", label: "Components", current: selected === "Components" },
          { value: "Navigation", label: "Navigation", current: selected === "Navigation" },
          { value: "Breadcrumb", label: "Breadcrumb", current: selected === "Breadcrumb" },
        ]}
        onItemSelect={(value) => setSelected(value)}
      />
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Breadcrumb homeHref="#" items={items} ariaLabel="Default breadcrumb" />
      <Breadcrumb showHome={false} items={items} ariaLabel="No home breadcrumb" />
      <Breadcrumb
        homeHref="#"
        items={[{ label: "Current page" }]}
        ariaLabel="Single page breadcrumb"
      />
    </div>
  ),
}
