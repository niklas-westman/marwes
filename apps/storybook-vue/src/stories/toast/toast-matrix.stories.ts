import { IconName, ThemeMode, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ToastProps } from "@marwes-ui/vue"
import {
  ErrorToast,
  Icon,
  InfoToast,
  MarwesProvider,
  SuccessToast,
  Toast,
  WarningToast,
} from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import "./toast-matrix.stories.css"

type ToastVariant = NonNullable<ToastProps["variant"]>

type MatrixEntry = {
  key: string
  component: string
  iconName?: IconName
  intent?: "neutral" | "brand"
  message: string
}

const TOAST_VARIANTS: Array<{ label: string; variant: ToastVariant }> = [
  { label: "SUBTLE", variant: "subtle" },
  { label: "OUTLINE", variant: "outline" },
  { label: "RICH", variant: "rich" },
]

const MATRIX_ENTRIES: MatrixEntry[] = [
  {
    key: "neutral",
    component: "Toast",
    iconName: IconName.XCircle,
    intent: "neutral",
    message: "Neutral message",
  },
  {
    key: "info",
    component: "InfoToast",
    message: "Meeting starts in 10 min",
  },
  {
    key: "success",
    component: "SuccessToast",
    message: "Your email is verified",
  },
  {
    key: "warning",
    component: "WarningToast",
    message: "Connection unstable",
  },
  {
    key: "error",
    component: "ErrorToast",
    message: "Something went wrong",
  },
  {
    key: "brand",
    component: "Toast",
    iconName: IconName.XCircle,
    intent: "brand",
    message: "Brand",
  },
]

const matrixToastClassName = "mw-toast--figma-matrix"

const meta = {
  title: "Toast/Purpose/Matrix",
  component: InfoToast as unknown as object,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<ToastProps>

export default meta

type Story = StoryObj<ToastProps>

function renderMatrix(args: { dark?: boolean; title: string; caption: string }) {
  return {
    components: { ErrorToast, Icon, InfoToast, MarwesProvider, SuccessToast, Toast, WarningToast },
    setup() {
      function entryProps(entry: MatrixEntry, variant: ToastVariant) {
        return {
          variant,
          className: matrixToastClassName,
          ...(entry.intent ? { dataAttributes: { "data-intent": entry.intent } } : {}),
        }
      }

      return {
        caption: args.caption,
        dark: args.dark ?? false,
        entryProps,
        matrixEntries: MATRIX_ENTRIES,
        matrixToastClassName,
        title: args.title,
        ThemeMode,
        toastVariants: TOAST_VARIANTS,
      }
    },
    template: `
      <MarwesProvider :theme="{ mode: dark ? ThemeMode.dark : ThemeMode.light }">
        <div :style="{
          background: dark ? '#2e2e2e' : '#ffffff',
          color: dark ? '#f9fafb' : '#141414',
          minHeight: '100vh',
          padding: '48px',
        }">
          <div style="max-width: 1144px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; line-height: 38px; letter-spacing: -0.03em;">
              {{ title }}
            </h1>
            <p :style="{
              margin: '4px 0 0',
              color: dark ? '#a3a3a3' : '#595959',
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
                  background: dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                }" />
                <div style="height: 24px;" />
              </template>

              <div :style="{
                fontSize: '11px',
                fontWeight: '500',
                lineHeight: '16px',
                letterSpacing: '0.08em',
                color: dark ? '#a3a3a3' : '#595959',
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
                  <component :is="entry.component" v-bind="entryProps(entry, row.variant)">
                    {{ entry.message }}
                    <template v-if="entry.iconName" #icon>
                      <Icon :name="entry.iconName" decorative />
                    </template>
                    <template #action>Close</template>
                  </component>
                </div>
              </div>

              <div v-if="rowIndex < toastVariants.length - 1" style="height: 24px;" />
            </template>
          </div>
        </div>
      </MarwesProvider>
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
        "Outline (default) · Subtle (quiet) · Rich (high-emphasis, use sparingly) · Toast states → Semantic → Brand → Primitives",
    }),
}
