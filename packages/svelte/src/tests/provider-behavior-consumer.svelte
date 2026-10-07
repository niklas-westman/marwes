<script lang="ts">
  import { useThemeMode } from "../lib/provider/use-theme-mode.js";

  const themeMode = useThemeMode();
</script>

<output data-provider-state
  >{themeMode.mode}:{themeMode.preference}:{themeMode.systemMode}:{themeMode.isSystem
    ? "system"
    : "concrete"}</output
>
<button
  type="button"
  data-provider-action="set-preference-system"
  aria-label="set-preference-system"
  onclick={() => themeMode.setPreference("system")}
></button>
<button
  type="button"
  data-provider-action="set-preference-dark"
  aria-label="set-preference-dark"
  onclick={() => themeMode.setPreference("dark")}
></button>
<button
  type="button"
  data-provider-action="set-mode-dark"
  aria-label="set-mode-dark"
  onclick={() => themeMode.setMode("dark")}
></button>
<button type="button" data-provider-action="toggle-mode"
  aria-label="toggle-mode" onclick={() => themeMode.toggleMode()}
></button>
