<script lang="ts">
  import { MarwesProvider, useTheme, useThemeMode } from "@marwes-ui/svelte"
</script>

<!-- Default provider -->
<MarwesProvider>
  <p>Default theme</p>
</MarwesProvider>

<!-- With custom theme -->
<MarwesProvider theme={{ mode: "dark" }}>
  <p>Dark mode</p>
</MarwesProvider>
