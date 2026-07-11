<script lang="ts">
  import { resolveThemeInput } from "@marwes-ui/core"
  import { H2, MarwesProvider, ThemeMode } from "@marwes-ui/svelte"
  import ColorSwatch from "./ColorSwatch.svelte"

  interface Props {
    defaultPreference: "light" | "dark"
  }

  const { defaultPreference }: Props = $props()

  const mode = $derived(defaultPreference === "dark" ? ThemeMode.dark : ThemeMode.light)
  const theme = $derived(resolveThemeInput({ mode }))

  const gridStyle = "display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;"
</script>

<MarwesProvider theme={{ mode }}>
  <div style={`display: flex; flex-direction: column; gap: 24px; padding: 24px; background: ${theme.color.background}; color: ${theme.color.text};`}>
    <H2>Provider Mode: {mode}</H2>
    <div style={gridStyle}>
      <ColorSwatch name="Background" hex={theme.color.background} cssVar="--mw-color-background" description="Provider-scoped background" />
      <ColorSwatch name="Surface" hex={theme.color.surface} cssVar="--mw-color-surface" description="Provider-scoped surface" />
      <ColorSwatch name="Text" hex={theme.color.text} cssVar="--mw-color-text" description="Provider-scoped text" />
    </div>
  </div>
</MarwesProvider>
