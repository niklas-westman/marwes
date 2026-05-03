import { storybookDocsDescription, storybookLayout } from "@marwes-ui/core"
import {
  Button,
  H2,
  H3,
  MarwesProvider,
  Paragraph,
  ThemeMode,
  useTheme,
  useThemeMode,
} from "@marwes-ui/react"
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
            cssVar="--mw-color-primary-base"
            description="Brand primary color"
            usage="Buttons, links, active states"
          />
          <ColorSwatch
            name="Primary Label"
            hex={theme.color.primary.label}
            cssVar="--mw-color-primary-label"
            description="Resolved text/icons on primary backgrounds"
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
            cssVar="--mw-color-secondary-base"
            description="Derived from primary - Secondary brand color"
            usage="Secondary buttons, backgrounds"
          />
          <ColorSwatch
            name="Secondary Label"
            hex={theme.color.secondary.label}
            cssVar="--mw-color-secondary-label"
            description="Resolved text/icons on secondary buttons"
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
            cssVar="--mw-color-success-base"
            description="Field Green - Positive states"
            usage="Success messages, checkmarks"
          />
          <ColorSwatch
            name="Success Label"
            hex={theme.color.success.label}
            cssVar="--mw-color-success-label"
            description="Resolved text/icons on success backgrounds"
            usage="Text on success banners"
          />

          <ColorSwatch
            name="Danger"
            hex={theme.color.danger.base}
            cssVar="--mw-color-danger-base"
            description="Coral Red - Error states"
            usage="Error messages, delete actions"
          />
          <ColorSwatch
            name="Danger Label"
            hex={theme.color.danger.label}
            cssVar="--mw-color-danger-label"
            description="Resolved text/icons on danger backgrounds"
            usage="Text on error banners"
          />

          <ColorSwatch
            name="Warning"
            hex={theme.color.warning.base}
            cssVar="--mw-color-warning-base"
            description="Amber Yellow - Warning states"
            usage="Warning messages, caution indicators"
          />
          <ColorSwatch
            name="Warning Label"
            hex={theme.color.warning.label}
            cssVar="--mw-color-warning-label"
            description="Resolved text/icons on warning backgrounds"
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
            cssVar="--mw-color-text"
            description="Default text color"
            usage="Body text, headings"
          />
          <ColorSwatch
            name="Text Muted"
            hex={theme.color.textMuted}
            cssVar="--mw-color-text-muted"
            description="Medium Grey - Secondary text"
            usage="Helper text, placeholders, captions"
          />
          <ColorSwatch
            name="Text Inverted"
            hex={theme.color.textInverted}
            cssVar="--mw-color-text-inverted"
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
            cssVar="--mw-color-background"
            description="Default White - Page background"
            usage="Main app background"
          />
          <ColorSwatch
            name="Surface"
            hex={theme.color.surface}
            cssVar="--mw-color-surface"
            description="Soft White - Card/panel backgrounds"
            usage="Cards, panels, dialogs"
          />
          <ColorSwatch
            name="Surface Inverted"
            hex={theme.color.surfaceInverted}
            cssVar="--mw-color-surface-inverted"
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
            cssVar="--mw-color-border"
            description="Light Grey - Default borders"
            usage="Input borders, dividers, outlines"
          />
          <ColorSwatch
            name="Border Subtle"
            hex={theme.color.borderSubtle}
            cssVar="--mw-color-border-subtle"
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
  background: var(--mw-color-primary-base);
  color: var(--mw-color-primary-label);
  border: 1px solid var(--mw-color-border);
}

.button:hover {
  background: color-mix(in srgb, var(--mw-color-primary-base) 90%, white);
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
              {`// Automatic label contrast
<MarwesProvider
  theme={{
    color: {
      primary: "#5B8CFF",
    }
  }}
>
  <App />
</MarwesProvider>

// Explicit brand override for filled text/icons
<MarwesProvider
  theme={{
    color: {
      primary: {
        base: "#5B8CFF",
        label: "#FFFFFF",
        labelDisabled: "rgba(255,255,255,0.5)",
      },
    }
  }}
>
  <App />
</MarwesProvider>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProviderModeSample() {
  const theme = useTheme()
  const { mode, toggleMode } = useThemeMode()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <H2 style={{ margin: 0 }}>Provider Mode: {mode}</H2>
        <Button variant="secondary" onClick={toggleMode}>
          Use {mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark} mode
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <ColorSwatch
          name="Background"
          hex={theme.color.background}
          cssVar="--mw-color-background"
          description="Provider-scoped background"
        />
        <ColorSwatch
          name="Surface"
          hex={theme.color.surface}
          cssVar="--mw-color-surface"
          description="Provider-scoped surface"
        />
        <ColorSwatch
          name="Text"
          hex={theme.color.text}
          cssVar="--mw-color-text"
          description="Provider-scoped text"
        />
      </div>
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
          cssVar="--mw-color-primary-base"
          description="Brand primary color"
        />
        <ColorSwatch
          name="Primary Label"
          hex={theme.color.primary.label}
          cssVar="--mw-color-primary-label"
          description="Resolved text/icons on primary backgrounds"
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
          cssVar="--mw-color-success-base"
          description="Field Green - Positive states"
        />
        <ColorSwatch
          name="Success Label"
          hex={theme.color.success.label}
          cssVar="--mw-color-success-label"
        />

        <ColorSwatch
          name="Danger"
          hex={theme.color.danger.base}
          cssVar="--mw-color-danger-base"
          description="Coral Red - Error states"
        />
        <ColorSwatch
          name="Danger Label"
          hex={theme.color.danger.label}
          cssVar="--mw-color-danger-label"
        />

        <ColorSwatch
          name="Warning"
          hex={theme.color.warning.base}
          cssVar="--mw-color-warning-base"
          description="Amber Yellow - Warning states"
        />
        <ColorSwatch
          name="Warning Label"
          hex={theme.color.warning.label}
          cssVar="--mw-color-warning-label"
        />
      </div>
    )
  },
}

export const ProviderModeLight: Story = {
  render: () => (
    <MarwesProvider defaultMode={ThemeMode.light}>
      <ProviderModeSample />
    </MarwesProvider>
  ),
}

export const ProviderModeDark: Story = {
  render: () => (
    <MarwesProvider defaultMode={ThemeMode.dark}>
      <ProviderModeSample />
    </MarwesProvider>
  ),
}
