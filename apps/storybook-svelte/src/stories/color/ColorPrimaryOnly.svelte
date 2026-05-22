<script lang="ts">
  import { useTheme } from "@marwes-ui/svelte"
  import ColorSwatch from "./ColorSwatch.svelte"

  const themeContext = useTheme()
  const gridStyle = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"
</script>

<div style={gridStyle}>
  <ColorSwatch
    name="Primary"
    hex={themeContext.theme.color.primary.base}
    cssVar="--mw-color-primary-base"
    description="Brand primary color"
  />
  <ColorSwatch
    name="Primary Label"
    hex={themeContext.theme.color.primary.label}
    cssVar="--mw-color-primary-label"
    description="Resolved text/icons on primary backgrounds"
  />
</div>
