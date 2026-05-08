<script lang="ts">
  import { useTheme, H2, Paragraph } from "@marwes-ui/svelte"
  import ColorSwatch from "./ColorSwatch.svelte"

  const { theme } = useTheme()

  const gridStyle = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"
  const sectionGap = "display: flex; flex-direction: column; gap: 48px;"
</script>

<div style={sectionGap}>
  <section>
    <H2>Primary Colors</H2>
    <Paragraph style="margin-bottom: 24px;">
      Main brand colors used throughout the interface. Primary is typically used for buttons,
      links, and key UI elements.
    </Paragraph>
    <div style={gridStyle}>
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

  <section>
    <H2>Secondary Colors</H2>
    <Paragraph style="margin-bottom: 24px;">
      Secondary colors for subtle UI elements and surfaces.
    </Paragraph>
    <div style={gridStyle}>
      <ColorSwatch
        name="Secondary"
        hex={theme.color.secondary.base}
        cssVar="--mw-color-secondary-base"
        description="Derived from primary — Secondary brand color"
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

  <section>
    <H2>Semantic Colors</H2>
    <Paragraph style="margin-bottom: 24px;">
      Contextual colors that communicate meaning (success, error, warning states).
    </Paragraph>
    <div style={gridStyle}>
      <ColorSwatch
        name="Success"
        hex={theme.color.success.base}
        cssVar="--mw-color-success-base"
        description="Field Green — Positive states"
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
        description="Coral Red — Error states"
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
        description="Amber Yellow — Warning states"
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

  <section>
    <H2>Text Colors</H2>
    <Paragraph style="margin-bottom: 24px;">
      Text colors for different hierarchy levels and contexts.
    </Paragraph>
    <div style={gridStyle}>
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
        description="Medium Grey — Secondary text"
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

  <section>
    <H2>Surface &amp; Background</H2>
    <Paragraph style="margin-bottom: 24px;">
      Background and surface colors for creating visual hierarchy and depth.
    </Paragraph>
    <div style={gridStyle}>
      <ColorSwatch
        name="Background"
        hex={theme.color.background}
        cssVar="--mw-color-background"
        description="Default White — Page background"
        usage="Main app background"
      />
      <ColorSwatch
        name="Surface"
        hex={theme.color.surface}
        cssVar="--mw-color-surface"
        description="Soft White — Card/panel backgrounds"
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

  <section>
    <H2>Borders</H2>
    <Paragraph style="margin-bottom: 24px;">
      Border colors for dividers, input outlines, and component boundaries.
    </Paragraph>
    <div style={gridStyle}>
      <ColorSwatch
        name="Border"
        hex={theme.color.border}
        cssVar="--mw-color-border"
        description="Light Grey — Default borders"
        usage="Input borders, dividers, outlines"
      />
      <ColorSwatch
        name="Border Subtle"
        hex={theme.color.borderSubtle}
        cssVar="--mw-color-border-subtle"
        description="Subtle dividers"
        usage="Subtle separators, light borders"
      />
    </div>
  </section>
</div>
