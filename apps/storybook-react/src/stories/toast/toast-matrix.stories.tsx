import { IconName, storybookLayout } from "@marwes-ui/core"
import {
  ErrorToast,
  Icon,
  InfoToast,
  SuccessToast,
  Toast,
  type ToastProps,
  WarningToast,
} from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"

type ToastVariant = NonNullable<ToastProps["variant"]>

type MatrixEntry = {
  key: string
  label: string
  render: (props: { className: string; variant: ToastVariant }) => React.ReactElement
}

const TOAST_VARIANTS: Array<{ label: string; variant: ToastVariant }> = [
  { label: "SUBTLE", variant: "subtle" },
  { label: "OUTLINE", variant: "outline" },
  { label: "RICH", variant: "rich" },
]

const MATRIX_ENTRIES: MatrixEntry[] = [
  {
    key: "neutral",
    label: "Neutral",
    render: ({ className, variant }) => (
      <Toast
        variant={variant}
        className={className}
        action="Close"
        icon={<Icon name={IconName.XCircle} decorative />}
        dataAttributes={{ "data-intent": "neutral" }}
      >
        Neutral message
      </Toast>
    ),
  },
  {
    key: "info",
    label: "Information",
    render: ({ className, variant }) => (
      <InfoToast variant={variant} className={className} action="Close">
        Meeting starts in 10 min
      </InfoToast>
    ),
  },
  {
    key: "success",
    label: "Success",
    render: ({ className, variant }) => (
      <SuccessToast variant={variant} className={className} action="Close">
        Your email is verified
      </SuccessToast>
    ),
  },
  {
    key: "warning",
    label: "Warning",
    render: ({ className, variant }) => (
      <WarningToast variant={variant} className={className} action="Close">
        Connection unstable
      </WarningToast>
    ),
  },
  {
    key: "error",
    label: "Error",
    render: ({ className, variant }) => (
      <ErrorToast variant={variant} className={className} action="Close">
        Something went wrong
      </ErrorToast>
    ),
  },
  {
    key: "brand",
    label: "Brand",
    render: ({ className, variant }) => (
      <Toast
        variant={variant}
        className={className}
        action="Close"
        icon={<Icon name={IconName.XCircle} decorative />}
        dataAttributes={{ "data-intent": "brand" }}
      >
        Brand
      </Toast>
    ),
  },
]

const matrixToastClassName = "mw-toast--figma-matrix"

const meta: Meta<typeof InfoToast> = {
  title: "Toast/Purpose/Matrix",
  component: InfoToast,
  parameters: storybookLayout.fullscreen,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof InfoToast>

function SectionDivider(props: { dark?: boolean }): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: 1,
        background: props.dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
      }}
    />
  )
}

function ToastMatrixFrame(props: {
  dark?: boolean
  title: string
  caption: string
}): React.ReactElement {
  const isDark = props.dark ?? false

  return (
    <div
      className={isDark ? "mw-theme--dark" : undefined}
      style={{
        background: isDark ? "#2e2e2e" : "#ffffff",
        color: isDark ? "#f9fafb" : "#141414",
        minHeight: "100vh",
        padding: 48,
      }}
    >
      <style>{`
        .${matrixToastClassName} {
          width: 100%;
          min-width: 0;
          max-width: none;
        }
      `}</style>
      <div style={{ maxWidth: 1144 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: "38px",
            letterSpacing: "-0.03em",
          }}
        >
          {props.title}
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            color: isDark ? "#a3a3a3" : "#595959",
            fontSize: 12,
            lineHeight: "16px",
            letterSpacing: "-0.03em",
          }}
        >
          {props.caption}
        </p>

        <div style={{ height: 32 }} />

        {TOAST_VARIANTS.map((row, rowIndex) => (
          <div key={row.variant}>
            {rowIndex > 0 && (
              <>
                <SectionDivider dark={isDark} />
                <div style={{ height: 24 }} />
              </>
            )}
            <div
              style={{
                marginBottom: 16,
                color: isDark ? "#a3a3a3" : "#595959",
                fontSize: 11,
                fontWeight: 500,
                lineHeight: "16px",
                letterSpacing: "0.08em",
              }}
            >
              {row.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {MATRIX_ENTRIES.map((entry) => (
                <div key={`${row.variant}-${entry.key}`} style={{ flex: "0 0 360px", width: 360 }}>
                  {entry.render({ className: matrixToastClassName, variant: row.variant })}
                </div>
              ))}
            </div>
            {rowIndex < TOAST_VARIANTS.length - 1 && <div style={{ height: 24 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export const Light: Story = {
  render: () => (
    <ToastMatrixFrame
      title="Toast"
      caption="Outline (default) · Subtle (quiet) · Rich (high-emphasis, use sparingly) · Toast states → Semantic → Brand → Primitives"
    />
  ),
}

export const Dark: Story = {
  render: () => (
    <ToastMatrixFrame
      dark
      title="Toast — Dark"
      caption="Outline (default) · Subtle (quiet) · Rich (high-emphasis, use sparingly) · Toast states → Semantic → Brand → Primitives"
    />
  ),
}
