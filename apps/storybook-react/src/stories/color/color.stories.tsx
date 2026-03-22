import { storybookDocsDescription, storybookLayout } from "@marwes-ui/core"
import { H2, H3, Paragraph, useTheme } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { ColorSwatch } from "./ColorSwatch"

const meta = {
  title: "Design System/Colors",
  tags: ["autodocs"],
  parameters: {
    ...storybookLayout.padded,
    docs: {
      description: {
        component: storybookDocsDescription.colors,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ColorPalette() {
  const theme = useTheme()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Primary Colors */}
      <section>
        <H2>Primary Colors</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Main brand colors used throughout the interface. Primary is typically used for buttons,
          links, and key UI elements.
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Primary"
            hex={theme.color.primary.base}
            cssVar="--mw-primary"
            description="Rich Black - Main brand color"
            usage="Buttons, links, active states"
          />
          <ColorSwatch
            name="Primary Label"
            hex={theme.color.primary.label}
            cssVar="--mw-primary-label"
            description="Text/icons on primary backgrounds (WCAG-derived)"
            usage="Text on primary buttons"
          />
        </div>
      </section>

      {/* Secondary Colors */}
      <section>
        <H2>Secondary Colors</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Secondary colors for subtle UI elements and surfaces.
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Secondary"
            hex={theme.color.secondary.base}
            cssVar="--mw-secondary"
            description="Derived from primary - Secondary brand color"
            usage="Secondary buttons, backgrounds"
          />
          <ColorSwatch
            name="Secondary Label"
            hex={theme.color.secondary.label}
            cssVar="--mw-secondary-label"
            description="Text/icons on secondary backgrounds (WCAG-derived)"
            usage="Text on secondary buttons"
          />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <H2>Semantic Colors</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Contextual colors that communicate meaning (success, error, warning states).
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Success"
            hex={theme.color.success.base}
            cssVar="--mw-success"
            description="Field Green - Positive states"
            usage="Success messages, checkmarks"
          />
          <ColorSwatch
            name="Success Label"
            hex={theme.color.success.label}
            cssVar="--mw-success-label"
            description="Text/icons on success backgrounds (WCAG-derived)"
            usage="Text on success banners"
          />

          <ColorSwatch
            name="Danger"
            hex={theme.color.danger.base}
            cssVar="--mw-danger"
            description="Coral Red - Error states"
            usage="Error messages, delete actions"
          />
          <ColorSwatch
            name="Danger Label"
            hex={theme.color.danger.label}
            cssVar="--mw-danger-label"
            description="Text/icons on danger backgrounds (WCAG-derived)"
            usage="Text on error banners"
          />

          <ColorSwatch
            name="Warning"
            hex={theme.color.warning.base}
            cssVar="--mw-warning"
            description="Amber Yellow - Warning states"
            usage="Warning messages, caution indicators"
          />
          <ColorSwatch
            name="Warning Label"
            hex={theme.color.warning.label}
            cssVar="--mw-warning-label"
            description="Text/icons on warning backgrounds (WCAG-derived)"
            usage="Text on warning banners"
          />
        </div>
      </section>

      {/* Text Colors */}
      <section>
        <H2>Text Colors</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Text colors for different hierarchy levels and contexts.
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Text"
            hex={theme.color.text}
            cssVar="--mw-text"
            description="Default text color"
            usage="Body text, headings"
          />
          <ColorSwatch
            name="Text Muted"
            hex={theme.color.textMuted}
            cssVar="--mw-text-muted"
            description="Medium Grey - Secondary text"
            usage="Helper text, placeholders, captions"
          />
          <ColorSwatch
            name="Text Inverted"
            hex={theme.color.textInverted}
            cssVar="--mw-text-inverted"
            description="Text on dark backgrounds"
            usage="Text on dark surfaces"
          />
        </div>
      </section>

      {/* Surface Colors */}
      <section>
        <H2>Surface & Background</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Background and surface colors for creating visual hierarchy and depth.
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Background"
            hex={theme.color.background}
            cssVar="--mw-background"
            description="Default White - Page background"
            usage="Main app background"
          />
          <ColorSwatch
            name="Surface"
            hex={theme.color.surface}
            cssVar="--mw-surface"
            description="Soft White - Card/panel backgrounds"
            usage="Cards, panels, dialogs"
          />
          <ColorSwatch
            name="Surface Inverted"
            hex={theme.color.surfaceInverted}
            cssVar="--mw-surface-inverted"
            description="Dark surface for contrast"
            usage="Dark mode surfaces, inverted UI"
          />
        </div>
      </section>

      {/* Border Colors */}
      <section>
        <H2>Borders</H2>
        <Paragraph style={{ marginBottom: "24px" }}>
          Border colors for dividers, input outlines, and component boundaries.
        </Paragraph>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <ColorSwatch
            name="Border"
            hex={theme.color.border}
            cssVar="--mw-border"
            description="Light Grey - Default borders"
            usage="Input borders, dividers, outlines"
          />
          <ColorSwatch
            name="Border Subtle"
            hex={theme.color.borderSubtle}
            cssVar="--mw-border-subtle"
            description="20% opacity black - Subtle dividers"
            usage="Subtle separators, light borders"
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          background: "#F9FAFB",
          borderRadius: "8px",
        }}
      >
        <H2>Usage in Components</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <H3>CSS Variables</H3>
            <pre
              style={{
                background: "#141414",
                color: "#F9FAFB",
                padding: "16px",
                borderRadius: "6px",
                overflow: "auto",
                fontSize: "13px",
                fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
              }}
            >
              {`.button {
  background: var(--mw-primary);
  color: var(--mw-on-primary);
  border: 1px solid var(--mw-border);
}

.button:hover {
  background: color-mix(in srgb, var(--mw-primary) 90%, white);
}`}
            </pre>
          </div>

          <div>
            <H3>Theme Override</H3>
            <pre
              style={{
                background: "#141414",
                color: "#F9FAFB",
                padding: "16px",
                borderRadius: "6px",
                overflow: "auto",
                fontSize: "13px",
                fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
              }}
            >
              {`<MarwesProvider
  theme={{
    color: {
      primary: "#5B8CFF",
    }
  }}
>
  <App />
</MarwesProvider>
// Label color is auto-derived via WCAG contrast — no onPrimary needed`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

export const AllColors: Story = {
  render: () => <ColorPalette />,
}

export const PrimaryOnly: Story = {
  render: () => {
    const theme = useTheme()
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        <ColorSwatch
          name="Primary"
          hex={theme.color.primary.base}
          cssVar="--mw-primary"
          description="Rich Black - Main brand color"
        />
        <ColorSwatch
          name="Primary Label"
          hex={theme.color.primary.label}
          cssVar="--mw-primary-label"
          description="Text/icons on primary backgrounds (WCAG-derived)"
        />
      </div>
    )
  },
}

export const SemanticOnly: Story = {
  render: () => {
    const theme = useTheme()
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        <ColorSwatch
          name="Success"
          hex={theme.color.success.base}
          cssVar="--mw-success"
          description="Field Green - Positive states"
        />
        <ColorSwatch
          name="Success Label"
          hex={theme.color.success.label}
          cssVar="--mw-success-label"
        />

        <ColorSwatch
          name="Danger"
          hex={theme.color.danger.base}
          cssVar="--mw-danger"
          description="Coral Red - Error states"
        />
        <ColorSwatch
          name="Danger Label"
          hex={theme.color.danger.label}
          cssVar="--mw-danger-label"
        />

        <ColorSwatch
          name="Warning"
          hex={theme.color.warning.base}
          cssVar="--mw-warning"
          description="Amber Yellow - Warning states"
        />
        <ColorSwatch
          name="Warning Label"
          hex={theme.color.warning.label}
          cssVar="--mw-warning-label"
        />
      </div>
    )
  },
}
