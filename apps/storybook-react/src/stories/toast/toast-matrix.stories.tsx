import { storybookLayout } from "@marwes-ui/core"
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
  type ToastProps,
  WarningToast,
} from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"

type ToastVariant = NonNullable<ToastProps["variant"]>

type MatrixEntry = {
  component: (props: ToastProps) => React.ReactElement
  label: string
  message: string
}

const TOAST_VARIANTS: Array<{ label: string; variant: ToastVariant }> = [
  { label: "SUBTLE", variant: "subtle" },
  { label: "OUTLINE", variant: "outline" },
  { label: "RICH", variant: "rich" },
]

const MATRIX_ENTRIES: MatrixEntry[] = [
  { component: InfoToast, label: "Information", message: "Meeting starts in 10 min" },
  { component: SuccessToast, label: "Success", message: "Your email is verified" },
  { component: WarningToast, label: "Warning", message: "Connection unstable" },
  { component: ErrorToast, label: "Error", message: "Something went wrong" },
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
        background: props.dark ? "rgba(255, 255, 255, 0.08)" : "rgba(20, 20, 20, 0.12)",
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
        background: isDark ? "#1f2937" : "#ffffff",
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
            color: isDark ? "#9ca3af" : "#4b5563",
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
                fontSize: 11,
                fontWeight: 500,
                lineHeight: "16px",
                letterSpacing: "0.08em",
                color: isDark ? "#9ca3af" : "#4b5563",
                marginBottom: 16,
              }}
            >
              {row.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {MATRIX_ENTRIES.map((entry) => {
                const Component = entry.component

                return (
                  <div
                    key={`${row.variant}-${entry.label}`}
                    style={{ flex: "0 0 360px", width: 360 }}
                  >
                    <Component
                      variant={row.variant}
                      action="Close"
                      className={matrixToastClassName}
                    >
                      {entry.message}
                    </Component>
                  </div>
                )
              })}
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
      caption="Semantic mode: Dark · Copy this frame, switch to Light mode → instant light version"
    />
  ),
}
