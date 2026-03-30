import { storybookLayout } from "@marwes-ui/core"
import type { ToastProps } from "@marwes-ui/vue"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

type ToastVariant = NonNullable<ToastProps["variant"]>

const TOAST_VARIANTS: Array<{ label: string; variant: ToastVariant }> = [
  { label: "SUBTLE", variant: "subtle" },
  { label: "OUTLINE", variant: "outline" },
  { label: "RICH", variant: "rich" },
]

const MATRIX_ENTRIES = [
  { key: "info", component: "InfoToast", message: "Meeting starts in 10 min" },
  { key: "success", component: "SuccessToast", message: "Your email is verified" },
  { key: "warning", component: "WarningToast", message: "Connection unstable" },
  { key: "error", component: "ErrorToast", message: "Something went wrong" },
] as const

const matrixToastClassName = "mw-toast--figma-matrix"

const meta = {
  title: "Toast/Purpose/Matrix",
  component: InfoToast as unknown as object,
  parameters: storybookLayout.fullscreen,
  tags: ["autodocs"],
} satisfies Meta<ToastProps>

export default meta

type Story = StoryObj<ToastProps>

function renderMatrix(args: { dark?: boolean; title: string; caption: string }) {
  return {
    components: { InfoToast, SuccessToast, WarningToast, ErrorToast },
    setup() {
      return {
        caption: args.caption,
        dark: args.dark ?? false,
        matrixEntries: MATRIX_ENTRIES,
        matrixToastClassName,
        title: args.title,
        toastVariants: TOAST_VARIANTS,
      }
    },
    template: `
      <div :class="dark ? 'mw-theme--dark' : undefined" :style="{
        background: dark ? '#1f2937' : '#ffffff',
        color: dark ? '#f9fafb' : '#141414',
        minHeight: '100vh',
        padding: '48px',
      }">
        <style>
          .${matrixToastClassName} {
            width: 100%;
            min-width: 0;
            max-width: none;
          }
        </style>
        <div style="max-width: 1144px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 700; line-height: 38px; letter-spacing: -0.03em;">
            {{ title }}
          </h1>
          <p :style="{
            margin: '4px 0 0',
            color: dark ? '#9ca3af' : '#4b5563',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '-0.03em',
          }">
            {{ caption }}
          </p>
          <div style="height: 32px;" />

          <template v-for="(row, rowIndex) in toastVariants" :key="row.variant">
            <template v-if="rowIndex > 0">
              <div :style="{
                width: '100%',
                height: '1px',
                background: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 20, 20, 0.12)',
              }" />
              <div style="height: 24px;" />
            </template>

            <div :style="{
              fontSize: '11px',
              fontWeight: '500',
              lineHeight: '16px',
              letterSpacing: '0.08em',
              color: dark ? '#9ca3af' : '#4b5563',
              marginBottom: '16px',
            }">
              {{ row.label }}
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              <div
                v-for="entry in matrixEntries"
                :key="row.variant + '-' + entry.key"
                style="flex: 0 0 360px; width: 360px;"
              >
                <component
                  :is="entry.component"
                  :variant="row.variant"
                  :class-name="matrixToastClassName"
                >
                  {{ entry.message }}
                  <template #action>Close</template>
                </component>
              </div>
            </div>

            <div v-if="rowIndex < toastVariants.length - 1" style="height: 24px;" />
          </template>
        </div>
      </div>
    `,
  }
}

export const Light: Story = {
  render: () =>
    renderMatrix({
      title: "Toast",
      caption:
        "Outline (default) · Subtle (quiet) · Rich (high-emphasis, use sparingly) · Toast states → Semantic → Brand → Primitives",
    }),
}

export const Dark: Story = {
  render: () =>
    renderMatrix({
      dark: true,
      title: "Toast — Dark",
      caption:
        "Semantic mode: Dark · Copy this frame, switch to Light mode → instant light version",
    }),
}
