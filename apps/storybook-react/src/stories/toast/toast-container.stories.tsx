import { storybookLayout } from "@marwes-ui/core"
import { ToastContainer, type ToastContainerProps, ToastProvider, useToast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"

const meta: Meta<typeof ToastContainer> = {
  title: "Toast/Molecule",
  component: ToastContainer,
  parameters: storybookLayout.fullscreen,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ToastContainer>

export const Stacked: Story = {
  args: {
    placement: "top-right",
    toasts: [
      { id: "saved", children: "Project saved.", intent: "success", duration: null },
      { id: "warning", children: "Storage is almost full.", intent: "warning", duration: null },
      { id: "error", children: "Publishing failed.", intent: "error", duration: null },
    ],
  } satisfies ToastContainerProps,
}

export const BottomLeft: Story = {
  args: {
    placement: "bottom-left",
    toasts: [
      { id: "info", children: "Release notes are available.", intent: "info", duration: null },
      { id: "saved", children: "Auto-save complete.", intent: "success", duration: null },
    ],
  } satisfies ToastContainerProps,
}

function ToastDemo(): React.ReactElement {
  const toast = useToast()

  return (
    <div style={{ padding: 24 }}>
      <button
        type="button"
        onClick={() => {
          toast.show({
            intent: "success",
            children: "Project saved.",
          })
        }}
      >
        Show success toast
      </button>
    </div>
  )
}

export const ImperativeAPI: Story = {
  render: () => (
    <ToastProvider placement="top-right">
      <ToastDemo />
    </ToastProvider>
  ),
}
