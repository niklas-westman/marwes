<script lang="ts">
  import { SkipLink } from "@marwes-ui/svelte"

  let { href = "#main", label = "Skip to main content" } = $props<{
    href?: string
    label?: string
  }>()
</script>

<div style="position: relative; min-height: 120px; padding: 1rem;">
  <SkipLink {href}>{label}</SkipLink>
  <p>Focus the page (press Tab) to reveal the skip link in the top-left.</p>
</div>
