import { storybookLayout } from "@marwes-ui/core"
import { TabGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Tab/Molecule",
  component: TabGroup,
  parameters: { ...storybookLayout.padded },
  tags: ["autodocs"],
} satisfies Meta<typeof TabGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { value: "tab1", label: "Overview", panel: "Overview content goes here." },
      { value: "tab2", label: "Details", panel: "Detailed information here." },
      { value: "tab3", label: "Settings", panel: "Settings panel." },
    ],
    defaultActiveTab: "tab1",
  },
}

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { value: "tab1", label: "Active", panel: "Active tab." },
      { value: "tab2", label: "Disabled", panel: "Cannot see this.", disabled: true },
      { value: "tab3", label: "Another", panel: "Another tab." },
    ],
  },
}
