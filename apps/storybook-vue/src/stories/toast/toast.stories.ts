import { storybookLayout } from "@marwes-ui/core"
import type { ToastProps } from "@marwes-ui/vue"
import { Toast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = ["subtle", "outline", "rich"] as const

const meta = {
  title: "Toast/Atom",
  component: Toast as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    ariaLive: { control: "select", options: ["polite", "assertive"] },
  },
} satisfies Meta<ToastProps>

export default meta
type Story = StoryObj<ToastProps>

export const Default: Story = {
  render: () => ({
    components: { Toast },
    template: "<Toast>Your changes have been saved.</Toast>",
  }),
}

export const WithDismiss: Story = {
  render: () => ({
    components: { Toast },
    setup() {
      return { onDismiss: () => {} }
    },
    template: `<Toast :onDismiss="onDismiss">Your changes have been saved.</Toast>`,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Toast },
    setup() {
      return { variants: VARIANTS, onDismiss: () => {} }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Toast v-for="v in variants" :key="v" :variant="v" :onDismiss="onDismiss">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }} — Your changes have been saved.
        </Toast>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { Toast },
    setup() {
      return { variants: VARIANTS, onDismiss: () => {} }
    },
    template: `
      <div class="mw-theme--dark" style="display: flex; flex-direction: column; gap: 12px; padding: 20px; background: #111827; border-radius: 8px;">
        <Toast v-for="v in variants" :key="v" :variant="v" :onDismiss="onDismiss">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }} — Dark mode toast.
        </Toast>
      </div>
    `,
  }),
}
