import { ThemeMode, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ToastProps } from "@marwes-ui/vue"
import { MarwesProvider, Toast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = ["subtle", "outline", "rich"] as const

const meta = {
  title: "Toast/Atom",
  component: Toast as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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
    components: { MarwesProvider, Toast },
    template: `
      <Toast>
        Your changes have been saved.
        <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
      </Toast>
    `,
  }),
}

export const DismissIconEscapeHatch: Story = {
  render: () => ({
    components: { Toast },
    setup() {
      return { onDismiss: () => {} }
    },
    template: `<Toast :onDismiss="onDismiss">Your changes have been saved.</Toast>`,
  }),
}

export const WithCustomAction: Story = {
  render: () => ({
    components: { Toast },
    template: `
      <Toast>
        File uploaded successfully.
        <template #action><button type="button" class="mw-toast__action-button">View file</button></template>
      </Toast>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Toast },
    setup() {
      return { ThemeMode, variants: VARIANTS }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Toast v-for="v in variants" :key="v" :variant="v">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }} — Your changes have been saved.
          <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
        </Toast>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { MarwesProvider, Toast },
    setup() {
      return { ThemeMode, variants: VARIANTS }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 20px; background: #000000; border-radius: 8px;">
          <Toast v-for="v in variants" :key="v" :variant="v">
            {{ v.charAt(0).toUpperCase() + v.slice(1) }} — Dark mode toast.
            <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
          </Toast>
        </div>
      </MarwesProvider>
    `,
  }),
}

export const Urgent: Story = {
  render: () => ({
    components: { Toast },
    template: `
      <Toast variant="rich" ariaLive="assertive">
        Session expired. Please log in again.
        <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
      </Toast>
    `,
  }),
}
