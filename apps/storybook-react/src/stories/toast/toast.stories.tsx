import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { MarwesProvider, ThemeMode, Toast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"

const VARIANTS = ["subtle", "outline", "rich"] as const
const INTENTS = ["neutral", "info", "success", "warning", "error"] as const

function ToastAction({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="mw-toast__action-button">
      {children}
    </button>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
            {capitalize(variant)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INTENTS.map((intent) => (
              <Toast
                key={`${variant}-${intent}`}
                variant={variant}
                dataAttributes={{ "data-intent": intent }}
                action={<ToastAction>Close</ToastAction>}
              >
                {capitalize(intent)} — {capitalize(variant)} toast message.
              </Toast>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const DarkVariants: Story = {
  render: () => (
    <MarwesProvider theme={{ mode: ThemeMode.dark }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: 20,
          background: "#0F0F0F",
          borderRadius: 8,
        }}
      >
        {VARIANTS.map((variant) => (
          <div key={variant}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>
              {capitalize(variant)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INTENTS.map((intent) => (
                <Toast
                  key={`${variant}-${intent}`}
                  variant={variant}
                  dataAttributes={{ "data-intent": intent }}
                  action={<ToastAction>Close</ToastAction>}
                >
                  {capitalize(intent)} — {capitalize(variant)} dark toast.
                </Toast>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MarwesProvider>
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
