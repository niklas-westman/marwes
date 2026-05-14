<script lang="ts">
  import { ThemeMode } from "@marwes-ui/svelte";
  import { useThemeMode } from "@marwes-ui/svelte";

  let { mode = $bindable(ThemeMode.light) }: { mode: string } = $props();

  const themeMode = useThemeMode();

  function toggle() {
    themeMode.toggleMode();
    mode = themeMode.isDark ? ThemeMode.light : ThemeMode.dark;
  }
</script>

<div class="theme-controls">
  <button class="theme-toggle" onclick={toggle}>
    {themeMode.isDark ? "☀️ Light" : "🌙 Dark"}
  </button>
  <span class="theme-label">Current: {themeMode.mode}</span>
</div>

<style>
  .theme-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .theme-toggle {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid currentColor;
    opacity: 0.6;
    background: transparent;
    color: inherit;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .theme-toggle:hover {
    opacity: 1;
  }

  .theme-label {
    font-size: 12px;
    opacity: 0.5;
  }
</style>
