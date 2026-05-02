import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Toast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"

const VARIANTS = ["subtle", "outline", "rich"] as const

function ToastAction({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="mw-toast__action-button">
      {children}
    </button>
  )
}

const meta: Meta<typeof Toast> = {
  title: "Toast/Atom",
  component: Toast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    ariaLive: { control: "select", options: ["polite", "assertive"] },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  args: {
    children: "Your changes have been saved.",
    action: <ToastAction>Close</ToastAction>,
  },
}

export const DismissIconEscapeHatch: Story = {
  args: { children: "Your changes have been saved.", onDismiss: () => {} },
}

export const WithCustomAction: Story = {
  args: {
    children: "File uploaded successfully.",
    action: <ToastAction>View file</ToastAction>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {VARIANTS.map((v) => (
        <Toast key={v} variant={v} action={<ToastAction>Close</ToastAction>}>
          {v.charAt(0).toUpperCase() + v.slice(1)} — Your changes have been saved.
        </Toast>
      ))}
    </div>
  ),
}

export const DarkVariants: Story = {
  render: () => (
    <div
      className="mw-theme--dark"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        background: "#000000",
        borderRadius: 8,
      }}
    >
      {VARIANTS.map((v) => (
        <Toast key={v} variant={v} action={<ToastAction>Close</ToastAction>}>
          {v.charAt(0).toUpperCase() + v.slice(1)} — Dark mode toast.
        </Toast>
      ))}
    </div>
  ),
}

export const Urgent: Story = {
  args: {
    children: "Session expired. Please log in again.",
    variant: "rich",
    ariaLive: "assertive",
    action: <ToastAction>Close</ToastAction>,
  },
}
