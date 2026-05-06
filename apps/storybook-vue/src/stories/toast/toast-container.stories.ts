import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ToastContainerProps } from "@marwes-ui/vue"
import { ToastContainer, ToastProvider, useToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { defineComponent, h } from "vue"

const meta = {
  title: "Toast/Molecule",
  component: ToastContainer as unknown as object,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<ToastContainerProps>

export default meta

type Story = StoryObj<ToastContainerProps>

export const Stacked: Story = {
  args: {
    placement: "top-right",
    toasts: [
      { id: "saved", children: "Project saved.", intent: "success", duration: null },
      { id: "warning", children: "Storage is almost full.", intent: "warning", duration: null },
      { id: "error", children: "Publishing failed.", intent: "error", duration: null },
    ],
  },
}

export const BottomLeft: Story = {
  args: {
    placement: "bottom-left",
    toasts: [
      { id: "info", children: "Release notes are available.", intent: "info", duration: null },
      { id: "saved", children: "Auto-save complete.", intent: "success", duration: null },
    ],
  },
}

const ToastTrigger = defineComponent({
  setup() {
    const toast = useToast()

    return () =>
      h(
        "button",
        {
          type: "button",
          onClick: () => {
            toast.show({ intent: "success", children: "Project saved." })
          },
        },
        "Show success toast",
      )
  },
})

export const ImperativeAPI: Story = {
  render: () => ({
    components: { ToastProvider, ToastTrigger },
    template: `
      <ToastProvider placement="top-right">
        <div style="padding: 24px;">
          <ToastTrigger />
        </div>
      </ToastProvider>
    `,
  }),
}
