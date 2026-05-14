import { ThemeMode, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ToastProps } from "@marwes-ui/vue"
import { MarwesProvider, Toast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = ["subtle", "outline", "rich"] as const
const INTENTS = ["neutral", "info", "success", "warning", "error"] as const

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

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
    components: { Toast },
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
      return { variants: VARIANTS, intents: INTENTS, capitalize }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div v-for="variant in variants" :key="variant">
          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280;">{{ capitalize(variant) }}</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <Toast
              v-for="intent in intents"
              :key="variant + '-' + intent"
              :variant="variant"
              :dataAttributes="{ 'data-intent': intent }"
            >
              {{ capitalize(intent) }} — {{ capitalize(variant) }} toast message.
              <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
            </Toast>
          </div>
        </div>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { MarwesProvider, Toast },
    setup() {
      return { ThemeMode, variants: VARIANTS, intents: INTENTS, capitalize }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px; background: #0F0F0F; border-radius: 8px;">
          <div v-for="variant in variants" :key="variant">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #9ca3af;">{{ capitalize(variant) }}</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <Toast
                v-for="intent in intents"
                :key="variant + '-' + intent"
                :variant="variant"
                :dataAttributes="{ 'data-intent': intent }"
              >
                {{ capitalize(intent) }} — {{ capitalize(variant) }} dark toast.
                <template #action><button type="button" class="mw-toast__action-button">Close</button></template>
              </Toast>
            </div>
          </div>
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
