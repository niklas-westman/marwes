<script lang="ts">
  import { useTheme } from "@marwes-ui/svelte"
  import ColorSwatch from "./ColorSwatch.svelte"

  const { theme } = useTheme()
  const gridStyle = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"
</script>

<div style={gridStyle}>
  <ColorSwatch name="Success" hex={$theme.color.success.base} cssVar="--mw-color-success-base" description="Field Green - Positive states" />
  <ColorSwatch name="Success Label" hex={$theme.color.success.label} cssVar="--mw-color-success-label" />
  <ColorSwatch name="Danger" hex={$theme.color.danger.base} cssVar="--mw-color-danger-base" description="Coral Red - Error states" />
  <ColorSwatch name="Danger Label" hex={$theme.color.danger.label} cssVar="--mw-color-danger-label" />
  <ColorSwatch name="Warning" hex={$theme.color.warning.base} cssVar="--mw-color-warning-base" description="Amber Yellow - Warning states" />
  <ColorSwatch name="Warning Label" hex={$theme.color.warning.label} cssVar="--mw-color-warning-label" />
</div>
