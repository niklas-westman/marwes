import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CancelButton, ConfirmButton, Drawer, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Drawer> = {
  title: "Drawer/Atom",
  component: Drawer,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    placement: { control: "select", options: ["left", "right"] },
    showFooter: { control: "boolean" },
    showScrim: { control: "boolean" },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Drawer>

const renderDrawer: NonNullable<Story["render"]> = (args) => (
  <Drawer
    {...args}
    onClose={() => undefined}
    footer={
      <>
        <CancelButton>Cancel</CancelButton>
        <ConfirmButton>Apply</ConfirmButton>
      </>
    }
  >
    <Paragraph>
      Keep workflow-specific state in the parent and use Drawer for the side panel shell.
    </Paragraph>
  </Drawer>
)

export const Default: Story = {
  args: {
    title: "Drawer title",
    description:
      "Drawer content goes here. Use for forms, detail panels, navigation, filters, or any secondary workflow.",
    size: "medium",
    placement: "right",
    showFooter: true,
    showScrim: true,
    dismissible: true,
    modal: true,
  },
  render: renderDrawer,
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <div key={size} style={{ position: "relative", height: 360, overflow: "hidden" }}>
          <Drawer
            title={`${size} drawer`}
            description={`${size} maps to the Figma drawer width token.`}
            size={size}
            modal
            showScrim={false}
            showFooter={false}
          >
            <Paragraph>Small is 320px, medium is 400px, and large is 560px.</Paragraph>
          </Drawer>
        </div>
      ))}
    </div>
  ),
}

export const LeftPlacement: Story = {
  args: {
    ...Default.args,
    placement: "left",
    title: "Left drawer",
  },
  render: renderDrawer,
}

export const WithoutFooter: Story = {
  args: {
    title: "Navigation drawer",
    description: "This drawer has no footer actions.",
    size: "small",
    placement: "right",
    showFooter: false,
    showScrim: true,
    dismissible: true,
    modal: true,
  },
  render: (args) => (
    <Drawer {...args} onClose={() => undefined}>
      <Paragraph>Use content-only mode for navigation and persistent panels.</Paragraph>
    </Drawer>
  ),
}
